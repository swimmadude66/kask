import {Database} from '../models/database.model';
import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db: Database = APP_CONFIG.database;

    router.use((req, res, next) => {
        if (!req.signedCookies || !req.signedCookies[APP_CONFIG.cookie_name]) {
            res.locals.user = undefined;
            return next();
        } else {
            let a_sess = req.signedCookies[APP_CONFIG.cookie_name];
            res.locals.session = a_sess;
            db.getUserInfoBySession(a_sess)
            .subscribe(
                result => {
                    res.locals.user = result;
                    return next();
                }, err => {
                    res.locals.user = undefined;
                    return next();
                }
            );
        }
    });

    router.get('/', (req, res) => {
        return res.status(200).send('Welcome to the API!');
    });

    router.use('/auth', require('./auth')(APP_CONFIG));

    router.use('/beers', require('./beers')(APP_CONFIG));

    router.use('/stats', require('./stats')(APP_CONFIG));

    // router.use((req, res, next) => {
    //     if (!res.locals.user) {
    //         return res.status(401).send('User must be logged in to access these routes');
    //     } else {
    //         return next();
    //     }
    // });

    router.use('/votes', require('./votes')(APP_CONFIG));

    // router.use((req, res, next) => {
    //     if (!res.locals.user.IsAdmin) {
    //         return res.status(403).send('User must be an admin to access these routes');
    //     } else {
    //         return next();
    //     }
    // });

    router.use('/polls', require('./polls')(APP_CONFIG));

    router.use('/admin', require('./admin')(APP_CONFIG));

    return router;
};
