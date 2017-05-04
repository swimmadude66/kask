import {Database} from '../models/database.model';
import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db: Database = APP_CONFIG.database;

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

    router.post('/session/:sessionId', (req, res) => {
        if (!req.body || !req.body.Vote) {
            return res.status(400).send('Vote is a required field');
        }
        let userId = res.locals.user.UserId;
        db.voteForSession(req.params.sessionId, userId, req.body.Vote)
        .subscribe(
            _ => res.status(204).end(),
            err => {
                console.error(err);
                return res.status(500).send('Could not vote for session');
            }
        );
    });

    return router;
};
