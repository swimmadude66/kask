import {Keg} from './keg.model';

export class BeerSession {
    SessionId: number;
    NetVote: number;
    UserVote: number;
    Keg: Keg;
    TapId: number;
}
