import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/pours', (req, res) => {
        db.getPours(req.query.fromDate, req.query.toDate).subscribe(
            pours => res.send({Pours: pours}),
            err => res.status(500).send('Could not retrieve pour history')
        );
    });
    
    router.get('/sessions', (req, res) => {
        db.getKegSessionHistory(req.query.fromDate, req.query.toDate).subscribe(
            sessions => res.send({Sessions: sessions}),
            err => res.status(500).send('Could not retrieve session history')
        );
    });

    return router;
};
