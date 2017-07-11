export enum Vote {
    Up = <any>'up',
    None = <any>'none',
    Down = <any>'down'
}

export class PollVote {
    UserId: number;
    Vote: Vote;
    PollBeerId: number;
}
