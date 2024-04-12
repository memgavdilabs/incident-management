using {ProcessorService} from './processor-service';

//change tracking annotations
annotate ProcessorService.Incidents with @changelog: [
    customer.name,
    createdAt
] {
    title    @changelog;
    status   @changelog;
    customer @changelog                            : [customer.name];
};

annotate ProcessorService.Conversations with @changelog: {keys: [
    author,
    timestamp
]} {
    message  @changelog  @Common.Label: 'Message';
};
