import axios, { AxiosResponse } from "axios";
import cds from "@sap/cds";
import { stat } from "fs";

const { GET, POST, PATCH, DELETE, expect } = cds.test(__dirname + "../../");

axios.defaults.auth = {
  username: "incident.support@tester.sap.com",
  password: "initial",
};

jest.setTimeout(11111);

//describe creates a block that groups together several related tests
describe("Test the GET endpoints", () => {
  //call it() to create a test closure
  it("Should check Incidents", async () => {
    const processorService = await cds.connect.to("ProcessorService");
    const { Incidents } = processorService.entities;
    // call chai style expect() to test against a value
    expect(await SELECT.from(Incidents)).to.have.length.greaterThan(0);
  });

  it("Should check Customers", async () => {
    const processorService = await cds.connect.to("ProcessorService");
    const { Customers } = processorService.entities;
    expect(await SELECT.from(Customers)).to.have.length(3);
  });

  it("Test expand entity endpoint", async () => {
    const { data } = await GET(
      `/odata/v4/processor/Customers?$select=firstName&$expand=incidents`
    );
    expect(data).to.be.an("object");
  });
});

describe("Draft Choreography APIs", () => {
  let draftId: string, incidentId: string;

  it("Create an incident", async () => {
    const { status, statusText, data } = await POST(
      `/odata/v4/processor/Incidents`,
      {
        title: "Urgent attention required",
        status_code: "N",
      }
    );
    draftId = data.ID;
    expect(status).to.equal(201);
    expect(statusText).to.equal("Created");
  });

  it("+ Activate the draft & check Urgency code as H using custom logic", async () => {
    const response = await POST(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`
    );
    expect(response.status).to.equal(201);
    expect(response.data.urgency_code).to.equal("H");
  });

  it("+ Test the incident status", async () => {
    const {
      status,
      data: { status_code, ID },
    } = await GET(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`
    );
    incidentId = ID;
    expect(status).to.equal(200);
    expect(status_code).to.equal("N");
  });

  //nested test group
  describe("Close incident and open it again to check Custom logic", () => {
    it(`Should close the incident-${draftId}`, async () => {
      const { status } = await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
        {
          PreserveChanges: true,
        }
      );
      expect(status).to.equal(201);
    });
    it(`Should close the incident-${draftId}`, async () => {
      const { status } = await PATCH(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`,
        {
          status_code: "C",
        }
      );
      expect(status).to.equal(200);
    });
    it(`+Activate the draft and check status code as C using custom logic`, async () => {
      const response = await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`
      );
      expect(response.status).to.eql(200);
    });
    it("+Test the incident status to be closed", async () => {
      const {
        status,
        data: { status_code },
      } = await GET(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)`
      );
      expect(status).to.eql(200);
      expect(status_code).to.eql("C");
    });

    describe("Should fail to re-open closed incident", () => {
      it(`Should open closed incident-${draftId}`, async () => {
        const { status } = await POST(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
          {
            PreserveChanges: true,
          }
        );
        expect(status).to.equal(201);
      });
      it(`Should re-open the incident-${draftId} but fail`, async () => {
        const { status } = await PATCH(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`,
          {
            status_code: "N",
          }
        );
        expect(status).to.equal(200);
      });
      it(`Should fail to activate draft trying to re-open the incident`, async () => {
        try {
          const response = await POST(
            `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`
          );
        } catch (e: any) {
          expect(e.response.status).to.equal(400);
          expect(e.response.data.error.message).to.include(
            `Cannot modify a closed incident`
          );
        }
      });
      it(`- Delete the draft`, async () => {
        const response = await DELETE(
          `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)`
        );
        expect(response.status).to.equal(204);
      });
    });
  });
});
