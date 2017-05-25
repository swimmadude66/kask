import {MysqlDatabase} from '../services/mysql_database';
import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db: MysqlDatabase = APP_CONFIG.database;
    const sockets = APP_CONFIG.IO.sockets;

    function socketUpdateTapContents(tapIds: number[]): void {
        tapIds.forEach((tapId) => {
            db.getTapContents(tapId)
            .subscribe(
                contents => sockets.emit('TapContentsEvent', contents)
            );
        });
    }

    function socketUpdateLocationContents(locationIds: number[]): void {
        locationIds.forEach(locationId => {
            db.getLocationContents(locationId)
            .subscribe(
                contents => sockets.emit('LocationContentsEvent', {LocationId: locationId, Contents: contents})
            );
        });
    }

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

    router.delete('/taps/:tapid', (req, res) => {
        db.deleteTap(req.params.tapid)
        .subscribe(
            result => res.send({Success: result}),
            err => res.status(500).send(err)
        );
    });

    router.post('/store/', (req, res) => {
        let body = req.body;
        if (!body || !body.BeerId || !body.LocationId || !body.Size) {
            return res.status(400).send('Missing required parameters');
        }
        return db.assignBeerToLocation(body.BeerId, body.LocationId, body.Size)
        .subscribe(
            result => {
                res.send({Success: result});
                socketUpdateLocationContents([body.LocationId]);
            }, err => res.status(500).send(err)
        );
    });

    router.post('/move/', (req, res) => {
        let body = req.body;
        if (!body || !body.KegId || !body.LocationId) {
            return res.status(400).send('Missing required parameters');
        }
        let kegId = body.KegId;
        let oldLoc: string;
        return db.findKeg(kegId)
        .flatMap(
            old => {
                oldLoc = old;
                return db.moveKegLocation(kegId, body.LocationId);
            }
        )
        .subscribe(
            result => {
                res.send({Success: result});
                let locations = [body.LocationId];
                if (oldLoc && oldLoc.indexOf('loc_') === 0) {
                    locations.push(+oldLoc.replace('loc_', ''));
                } else if (oldLoc && oldLoc.indexOf('tap_') === 0) {
                    socketUpdateTapContents([+oldLoc.replace('tap_', '')]);
                }
                socketUpdateLocationContents(locations);
            }, err => res.status(500).send(err)
        );
    });

    router.post('/tap/:tapId', (req, res) => {
        let body = req.body;
        let tapId = +req.params.tapId;
        if (!body) {
            return res.status(400).send('Missing required parameters');
        }
        let method;
        let kegId;
        let oldLoc: string;
        if (body.KegId) {
            kegId = body.KegId;
            method = db.findKeg(kegId)
            .flatMap(
                old => {
                    oldLoc = old;
                    return db.tapKeg(kegId, tapId);
                }
            );
        } else if (body.BeerId) {
            if (!body.Size) {
                return res.status(400).send('Size is required when BeerId is provided');
            }
            method = db.tapBeer(body.BeerId, tapId, body.Size || null);
        } else {
            return res.status(400).send('Must specify one of KegId or BeerId');
        }
        return method
        .subscribe(
            result => {
                res.send({Success: !!result});
                let taps = [tapId];
                if (kegId) {
                    if (oldLoc && oldLoc.indexOf('loc_') === 0) {
                        socketUpdateLocationContents([+oldLoc.replace('loc_', '')]);
                    } else if (oldLoc && oldLoc.indexOf('tap_') === 0) {
                        taps.push(+oldLoc.replace('tap_', ''));
                    }
                }
                return socketUpdateTapContents(taps);
            },
            err => res.status(500).send(err)
        );
    });

    router.post('/clear/:tapId', (req, res) => {
        let tapId = +req.params.tapId;
        return db.emptyTap(tapId)
        .subscribe(
            result => {
                res.send({Success: result});
                return socketUpdateTapContents([tapId]);
            },
            err => res.status(500).send(err)
        );
    });

    router.post('/completepour/:tapId', (req, res) => {
        if (!req.body || !req.body.Volume) {
            return res.status(400).send('Volume is required');
        }
        let tapId = +req.params.tapId;
        db.adjustTapVolume(tapId, req.body.Volume, req.body.Timestamp)
        .subscribe(
            _ => {
                res.status(204).end();
                return socketUpdateTapContents([tapId]);
            },
            err => res.status(500).send('could not update poured volume')
        );
    });

    router.post('/beers/scale/', (req, res) => {
        let body = req.body;
        if (!body || !body.BeerId || !body.Scale) {
            return res.status(400).send('BeerId and Scale are required fields');
        }
        db.saveBeerLabelScale(body.BeerId, body.Scale).subscribe(
            _ => res.status(204).end(),
            err => {
                console.error(err);
                return res.status(500).send('Could not scale label scale');
            }
        );
    });

    return router;
};
