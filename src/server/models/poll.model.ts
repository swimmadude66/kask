import { PollBeer } from './pollbeer.model';
import { PollVote } from './pollvote.model';

export class Poll {
    PollId: number;
    Title: string;
    Description: string;
    VotesPerUser: number;
    Active: boolean;
    PollBeers?: PollBeer[];
    PollVotes?: PollVote[]
}
