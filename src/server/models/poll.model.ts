import { PollVote } from './pollvote.model';

export class Poll {
    PollId: number;
    Title: string;
    Description: string;
    VotesPerUser: number;
    Active: boolean;
    PollVotes?: PollVote[]//TODO: vote is model for pollvotes table, only getPoll populates it, and we use this to determin if user can voet
}
