import {Keg} from './index';

export class TapSession {
    SessionId: number;
    NetVote: number;
    UserVote: number;
    TappedTime: string;
    RemovalTime: string;
    TapId: number;
    Keg: Keg;
}
