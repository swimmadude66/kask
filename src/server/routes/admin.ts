import {MysqlDatabase} from '../services/mysql_database';
import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db: MysqlDatabase = APP_CONFIG.database;

    router.get('/search/:beername', (req, res) => {
        let q = req.params.beername;
        return APP_CONFIG.beer_service.searchForBeer(q)
        .subscribe(
            beers => res.send({numBeers: beers.length, beers}),
            err => res.status(500).send(err)
        );
    });

    router.post('/locations', (req, res) => {
        let body = req.body;
        if (!body || !body.Name) {
            return res.status(400).send('Locations require a name');
        }
        db.addLocation(body.Name, body.Description || null)
        .subscribe(
            result => res.send({LocationId: result}),
            err => res.status(500).send(err)
        );
    });

    router.patch('/locations', (req, res) => {
        let body = req.body;
        if (!body || !body.LocationId) {
            return res.status(400).send('Need the id of the location to update');
        }
        if (!body.Name) {
            return res.status(400).send('Locations require a name');
        }
        db.editLocation(body.LocationId, body.Name, body.Description || null)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    router.delete('/locations', (req, res) => {
        let body = req.body;
        if (!body || !body.LocationId) {
            return res.status(400).send('Need the id of the location to remove');
        }
        db.deleteLocation(body.LocationId)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    router.post('/taps', (req, res) => {
        let body = req.body;
        if (!body || !body.TapName) {
            return res.status(400).send('Taps require a name');
        }
        db.addTap(body.TapName, body.Description || null, body.Status || null)
        .subscribe(
            result => res.send({TapId: result}),
            err => res.status(500).send(err)
        );
    });

    router.patch('/taps', (req, res) => {
        let body = req.body;
        if (!body || !body.TapId) {
            return res.status(400).send('Need TapId to update');
        }
        if (!body.TapName) {
            return res.status(400).send('Taps require a name');
        }
        db.editTap(body.TapId, body.TapName, body.Description || null, body.Status || null)
        .subscribe(
            result => res.send(result),
            err => res.status(500).send(err)
        );
    });

    router.delete('/taps', (req, res) => {
        let body = req.body;
        if (!body || !body.TapId) {
            return res.status(400).send('Need TapId to remove');
        }
        db.deleteTap(body.TapId)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    router.post('/store/', (req, res) => {
        let body = req.body;
        if (!body || !body.BeerId || !body.LocationId) {
            return res.status(400).send('Missing required parameters');
        }
        return db.assignBeerToLocation(body.BeerId, body.LocationId, body.Size || null)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    router.post('/move/', (req, res) => {
        let body = req.body;
        if (!body || !body.KegId || !body.LocationId) {
            return res.status(400).send('Missing required parameters');
        }
        return db.moveKegLocation(body.KegId, body.LocationId)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    router.post('/tap/:tapId', (req, res) => {
        let body = req.body;
        let tapId = +req.params.tapId;
        if (!body) {
            return res.status(400).send('Missing required parameters');
        }
        let method;
        if (body.KegId) {
            method = db.tapKeg(body.KegId, tapId);
        } else if (body.BeerId) {
            method = db.tapBeer(body.BeerId, tapId, body.Size || null);
        } else {
            return res.status(400).send('Must specify one of KegId or BeerId');
        }
        return method
        .subscribe(
            result => res.send({Success: !!result}),
            err => res.status(500).send(err)
        );
    });

    router.post('/clear/:tapId', (req, res) => {
        let tapId = +req.params.tapId;
        return db.emptyTap(tapId)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    return router;
};
