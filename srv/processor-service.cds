using {sap.capire.incidents as my} from '../db/schema';

service ProcessorService {
    @odata.draft.enabled
    entity Incidents as projection on my.Incidents;

    @readonly
    entity Customers as projection on my.Customers;

}

//calulated element
extend projection ProcessorService.Customers with {
    firstName || ' ' || lastName as name : String
}
