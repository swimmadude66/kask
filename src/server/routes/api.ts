import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        return res.status(200).send('Welcome to the API!');
    });

    router.use('/beers', require('./beers')(APP_CONFIG));


    router.use((req, res, next) => {
        if (!req.signedCookies || !req.signedCookies[APP_CONFIG.cookie_name]) {
            res.locals.user = null;
            return next();
        } else {
            // let a_sess = req.signedCookies[APP_CONFIG.cookie_name];
            return next();
        }
    });

    router.use((req, res, next) => {
        if (!res.locals.user) {
            return res.status(401).send('401 UNAUTHORIZED');
        } else {
            return next();
        }
    });

    router.use('/admin', require('./admin')(APP_CONFIG));

    return router;
};
