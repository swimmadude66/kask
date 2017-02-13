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
            result => res.send({Success: result}),
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
            result => res.send({Success: result}),
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
            result => res.send({Success: result}),
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

    // @TODO implement endpoint for these functions
    // assignBeerToLocation(beerId: number, locationId: number, size?: KegSize): Observable<boolean>;
    // moveKegLocation(kegId: number, newLocationId: number): Observable<boolean>;
    // tapKeg(kegId: number, tapId: number): Observable<number>;
    // tapBeer(beerId: number, tapId: number, size?: KegSize): Observable<number>;
    // emptyTap(tapId: number): Observable<boolean>;

    return router;
};
