import { Customer } from "#cds-models/ProcessorService";
import { BusinessPartner } from "#cds-models/RemoteService";
import {
  EntityHandler,
  OnRead,
  type TypedRequest,
} from "@dxfrontier/cds-ts-dispatcher";
import { LoggerFactory } from "@gavdi/caplog";
import cds from "@sap/cds";

const logger = LoggerFactory.createLogger("CustomersHandler");

@EntityHandler(Customer)
export default class CustomersHandler {
  @OnRead()
  public async onReadCustomer(req: TypedRequest<Customer>, next: Function) {
    logger.info(`>> delegating to remote service...`, req.query);

    //connect to the external service
    const S4bupa = await cds.connect.to("API_BUSINESS_PARTNER");

    // Expands are required as the runtime does not support path expressions for remote services
    let result = await S4bupa.run(
      SELECT.from(BusinessPartner.name, (bp: any) => {
        bp("*"),
          bp.addresses((address: any) => {
            address("email"),
              address.email((emails: any) => {
                emails("email");
              });
          });
      })
    );

    result = result.map((bp: any) => ({
      ID: bp.ID,
      name: bp.name,
      email: bp.addresses[0]?.email[0]?.email,
    }));

    //Explicitly setting $count so the values show up in the value help in the UI
    result.$count = result?.length;

    return result;
  }
}
