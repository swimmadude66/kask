import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();

    router.get('/search/:beername', (req, res) => {
        let q = req.params.beername;
        return APP_CONFIG.beer_service.searchForBeer(q)
        .subscribe(
            beers => res.send({numBeers: beers.length, beers}),
            err => res.status(400).send(err)
        );
    });

    return router;
};
