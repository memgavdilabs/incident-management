using {
    cuid,
    managed,
    sap.common.CodeList,
    User
} from '@sap/cds/common';

namespace sap.capire.incidents;

/**
 * Incidents created by customers
 */
entity Incidents : cuid, managed {
    customer     : Association to Customers;
    title        : String @title: 'Title';
    urgency      : Association to Urgency;
    status       : Association to Status;
    conversation : Composition of many Conversations
                       on conversation.parent = $self;
}

entity Conversations {
    key ID        : UUID;
    key parent    : Association to Incidents;
        timestamp : type of managed : createdAt;
        author    : type of managed : createdBy;
        message   : String;
}

/**
 * Customers entitled to create support incdents
 */
entity Customers : cuid, managed {
    firstName : String;
    lastName  : String;
    email     : EMailAddress;
    phone     : PhoneNumber;
    incidents : Association to many Incidents
                    on incidents.customer = $self;
}

entity Status : CodeList {
    key code        : String enum {
            new        = 'N';
            assigned   = 'A';
            in_process = 'I';
            on_hold    = 'H';
            resolved   = 'R';
            closed     = 'C';
        };
        criticality : Integer;
}

entity Urgency : CodeList {
    key code : String enum {
            high   = 'H';
            medium = 'M';
            low    = 'L';
        };
}

type EMailAddress : String;
type PhoneNumber  : String;
type City         : String;
