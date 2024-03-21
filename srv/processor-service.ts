import { CDSDispatcher } from "@dxfrontier/cds-ts-dispatcher";
import { IncidentsHandler } from "./controller/processor-service/handler/IncidentsHandler";
import CustomersHandler from "./controller/processor-service/handler/CustomersHandler";

module.exports = new CDSDispatcher([
  //entities
  IncidentsHandler,
  CustomersHandler,
  //draft
  //unbound actions
]).initialize();
