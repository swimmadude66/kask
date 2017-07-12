import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/', (req, res) => {
        db.getPolls().subscribe(
            polls => res.send({Polls: polls}),
            err => res.status(500).send('Could not retrieve polls')
        );
    });

    router.get('/:pollId', (req, res) => {
        db.getPoll(req.params.pollId).subscribe(
            poll => res.send({Poll: poll}),
            err => res.status(500).send('Could not retrieve poll')
        );
    });

    return router;
};
