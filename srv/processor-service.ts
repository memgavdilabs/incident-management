import { CDSDispatcher } from "@dxfrontier/cds-ts-dispatcher";
import { IncidentsHandler } from "./controller/processor-service/handler/IncidentsHandler";

module.exports = new CDSDispatcher([
  //entities
  IncidentsHandler,
  //draft
  //unbound actions
]).initialize();
