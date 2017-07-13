export enum Vote {
    Up = <any>'up',
    None = <any>'none',
    Down = <any>'down'
}

export class PollVote {
    PollVoteId: number;
    UserId: number;
    Vote: Vote;
    PollBeerId: number;
}
