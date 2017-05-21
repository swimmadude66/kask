import {Keg} from './keg.model';

export class BeerSession {
    SessionId: number;
    NetVote: number;
    UserVote: number;
    TappedTime: string;
    RemovalTime: string;
    Keg: Keg;
    TapId: number;
}
