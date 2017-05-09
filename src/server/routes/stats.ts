import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/pours', (req, res) => {
        db.getPours().subscribe(
            pours => res.send({Pours: pours}),
            err => res.status(500).send('Could not retrieve pour history')
        );
    });

    return router;
};
