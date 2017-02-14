import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/taps', (req, res) => {
        db.getTaps()
        .subscribe(
            taps => res.send(taps),
            err => res.status(500).send(err)
        );
    });

    router.get('/taps/:tapId', (req, res) => {
        db.getTap(+req.params.tapId)
        .subscribe(
            tap => res.send(tap),
            err => res.status(500).send(err)
        );
    });

    router.get('/locations', (req, res) => {
        db.getLocations()
        .subscribe(
            locations => res.send(locations),
            err => res.status(500).send(err)
        );
    });

    router.get('/locations/:locationId', (req, res) => {
        db.getLocation(+req.params.locationId)
        .subscribe(
            location => res.send(location),
            err => res.status(500).send(err)
        );
    });

    router.get('/styles', (req, res) => {
        db.getStyles()
        .subscribe(
            styles => res.send(styles),
            err => res.status(500).send(err)
        );
    });

    router.get('/styles/:styleId', (req, res) => {
        db.getStyle(+req.params.styleId)
        .subscribe(
            style => res.send(style),
            err => res.status(500).send(err)
        );
    });

    router.get('/breweries', (req, res) => {
        db.getBreweries()
        .subscribe(
            breweries => res.send(breweries),
            err => res.status(500).send(err)
        );
    });

    router.get('/breweries/:breweryId', (req, res) => {
        db.getBrewery(+req.params.breweryId)
        .subscribe(
            brewery => res.send(brewery),
            err => res.status(500).send(err)
        );
    });

    router.get('/contents/location/:locationId', (req, res) => {
        db.getLocationContents(+req.params.locationId)
        .subscribe(
            contents => res.send(contents),
            err => res.status(500).send(err)
        );
    });

    router.get('/contents/tap/:tapId', (req, res) => {
        db.getTapContents(+req.params.tapId)
        .subscribe(
            contents => {
                return res.send(!!contents ? contents : false);
            },
            err => res.status(500).send(err)
        );
    });

/*
 * Keep these last, or every other route will be matched as a beerId
 */
    router.get('/', (req, res) => {
        db.getBeers()
        .subscribe(
            beers => res.send(beers),
            err => res.status(500).send(err)
        );
    });

    router.get('/:beerId', (req, res) => {
        db.getBeer(+req.params.beerId)
        .subscribe(
            beer => res.send(beer),
            err => res.status(500).send(err)
        );
    });

    return router;
};
