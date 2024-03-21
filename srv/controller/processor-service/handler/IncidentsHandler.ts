import { Incident } from "#cds-models/ProcessorService";
import {
  BeforeCreate,
  BeforeUpdate,
  EntityHandler,
  type TypedRequest,
} from "@dxfrontier/cds-ts-dispatcher";

@EntityHandler(Incident)
export class IncidentsHandler {
  //method that raises incident urgency to high if it detects 'urgent' in incident title
  @BeforeCreate()
  public async beforeCreateIncident(req: TypedRequest<Incident>) {
    const data = req.data;
    if (data) {
      const incidents = Array.isArray(data) ? data : [data];
      incidents.forEach((incident) => {
        if (incident.title?.toLowerCase().includes("urgent")) {
          incident.urgency = { code: "H", descr: "High" };
        }
      });
    }
  }

  //vaidation on updating closed incidents
  @BeforeUpdate()
  public async validateUpdationOfClosedIncidents(req: TypedRequest<Incident>) {
    const { status_code } = await SELECT.one.from(Incident).where({
      ID: req.data.ID,
    });
    if (status_code === "C")
      return req.reject(400, `Cannot modify a closed incident`);
  }
}
