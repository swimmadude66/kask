import {Database} from '../models/database.model';
import * as express from 'express';
import { Observable } from 'rxjs/Rx';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db: Database = APP_CONFIG.database;
    const sockets = APP_CONFIG.IO.sockets;

    // router.get('/session/:sessionId', (req, res) => {
    //     db.getSessionVotes(req.params.sessionId)
    //     .subscribe(
    //         _ => res.send(_),
    //         err => {
    //             console.error(err);
    //             return res.status(500).send('Could not get votes for session');
    //         }
    //     );
    // });

    router.post('/tap/:tapId', (req, res) => {
        if (!req.body || !req.body.Vote) {
            return res.status(400).send('Vote is a required field');
        }
        let userId = res.locals.user.UserId;
        let tapId = +req.params.tapId;
        db.voteForTap(tapId, userId, req.body.Vote)
        .subscribe(
            _ => {
                res.status(204).end();
                // emit to sockets
                return db.getTapContents(tapId, +userId)
                .subscribe(
                    contents => sockets.emit('TapContentsEvent', {TapId: tapId, Contents: contents})
                );
            },
            err => {
                console.error(err);
                return res.status(500).send('Could not vote for session');
            }
        );
    });

    router.post('/session/:sessionId', (req, res) => {
        if (!req.body || !req.body.Vote) {
            return res.status(400).send('Vote is a required field');
        }
         let userId = 1; //res.locals.user.UserId;
        db.voteForSession(req.params.sessionId, userId, req.body.Vote)
        .subscribe(
            _ => res.status(204).end(),
            err => {
                console.error(err);
                return res.status(500).send('Could not vote for session');
            }
        );
    });

    router.post('/poll/:pollId/beer', (req, res) => {
        if (!req.body || !req.body.Vote || !req.body.PollBeerId) {
            return res.status(400).send('Vote and PollBeerId are required fields');
        }
        let userId = 1; //res.locals.user.UserId;

        db.userCanVoteForPoll(req.params.pollId, userId)
        .flatMap(canVote => canVote
            ? db.voteForPollBeer(req.body.PollBeerId, userId, req.body.Vote)
            : Observable.throw(''))
        .subscribe(
            _ => res.status(204).end(),
            err => {
                console.error(err);
                return res.status(500).send('Could not vote for poll beer');
            }
        );
    });

    return router;
};
