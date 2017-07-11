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

    router.post('/', (req, res) => {
        let body = req.body;
        if (!body || !body.Title) {
            return res.status(400).send('Polls require a title');
        }
        db.addPoll(body.Title, body.Description, body.VotesPerUser, body.Beers)
        .subscribe(
            pollId => res.send({PollId: pollId}),
            err => res.status(500).send(err)
        );
    });

    router.put('/:pollId/beer', (req, res) => {
        let body = req.body;
        if (!body || !body.BeerId) {
            return res.status(400).send('BeerId is required');
        }

        db.addBeerToPoll(req.params.pollId, body.BeerId, body.Size || '')
            .subscribe(
                pollBeerId => res.send({PollBeerId: pollBeerId}),
                err => res.status(500).send(err)
            );
    });

    router.delete('/:pollId/beer', (req, res) => {
        let body = req.body;
        if (!body || !body.PollBeerId) {
            return res.status(400).send('PollBeerId is required');
        }

        db.removeBeerFromPoll(req.params.pollId, body.PollBeerId)
            .subscribe(
                _ => res.send(),
                err => res.status(500).send(err)
            );
    });

    router.patch('/:pollId', (req, res) => {
        let body = req.body;

        db.updatePoll(req.params.pollId, body.Title, body.Description, body.VotesPerUser, body.Active)
            .subscribe(
                _ => res.send(),
                err => res.status(500).send(err)
            );
    });

    return router;
};
