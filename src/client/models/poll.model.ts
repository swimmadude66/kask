import { PollVote } from './pollvote.model';
import { PollBeer } from './pollbeer.model';

export class Poll {
    PollId: number;
    Title: string;
    Description: string;
    VotesPerUser: number;
    Active: boolean;
    PollBeers?: PollBeer[];
    PollVotes?: PollVote[]
}
