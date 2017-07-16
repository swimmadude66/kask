export enum Vote {
    Up = <any>'up',
    None = <any>'none',
    Down = <any>'down'
}

export class OrderVote {
    OrderVoteId: number;
    UserId: number;
    Vote: number;
    OrderBeerId: number;
}
