import { OrderVote } from './ordervote.model';
import { OrderBeer } from './orderbeer.model';

export enum OrderStatus {
    Incomplete = <any>'incomplete',
    Pending = <any>'pending',
    Finalized = <any>'finalized',
    Cancelled = <any>'cancelled',
    Placed = <any>'placed',
    Received = <any>'received'
}

export class Order {
    OrderId: number;
    Title: string;
    Description: string;
    VotesPerUser: number;
    Status: OrderStatus;
    PlacedDate?: Date;
    ReceivedDate?: Date;
    OrderBeers?: OrderBeer[];
    OrderVotes?: OrderVote[];
}
