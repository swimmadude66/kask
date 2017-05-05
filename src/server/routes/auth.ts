import {Database} from '../models';
import {Observable} from 'rxjs/Rx';
import * as express from 'express';
import * as uuid from 'uuid/v4';
import {createHash} from 'crypto';

module.exports = (APP_CONFIG) => {
            const router = express.Router();
            const db: Database = APP_CONFIG.database;

            router.get('/', (req, res) => {
                let user = res.locals.user;
                if (user) {
            return res.send({isAuth: true});
        } else {
            return res.send({isAuth: false});
        }
    });

    router.post('/signup', (req, res) => {
        let body = req.body;
        if (!body || !body.Email || !body.Password) {
            return res.status(400).send('Email and Password are required fields');
        }
        let salt = uuid();
        let passHash = createHash('sha512').update(salt + '|' + body.Password).digest('hex');
        db.registerUser(body.Email, salt, passHash)
        .flatMap(
            userId => {
                let session = uuid();
                return db.generateSession(session, userId);
            }
        ).subscribe(
            sessionId => {
                res.cookie(APP_CONFIG.cookie_name, sessionId, {
                    signed: true,
                    secure: req.secure,
                    sameSite: true,
                    httpOnly: true,
                    path: '/',
                    maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years...
                });
                return res.status(204).end();
            }, err => {
                return res.status(500).send('Could not complete signup');
            }
        );
    });

    router.post('/login', (req, res) => {
        let body = req.body;
        if (!body || !body.Email || !body.Password) {
            return res.status(400).send('Email and Password are required fields');
        }
        db.getPasswordInfo(body.Email)
        .flatMap(
            user => {
                let hash = createHash('sha512').update(user.Salt + '|' + body.Password).digest('hex');
                if (hash !== user.PasswordHash) {
                    return Observable.throw('Could not login user');
                }
                let session = uuid();
                return db.generateSession(session, user.UserId);
            }
        ).subscribe(
            sessionId => {
                res.cookie(APP_CONFIG.cookie_name, sessionId, {
                    signed: true,
                    secure: req.secure,
                    sameSite: true,
                    httpOnly: true,
                    path: '/',
                    maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years...
                });
                return res.status(204).end();
            }, err => {
                return res.status(500).send('Could not login');
            }
        );
    });

    router.post('/logout', (req, res) => {
        if (!res.locals.session) {
            return res.send(400).send('you must be logged in to log out');
        }
        res.clearCookie(APP_CONFIG.cookie_name);
        db.invalidateSession(res.locals.session).subscribe(
            _ => res.status(204).end(),
            err => res.status(204).end()
        );
    });

    return router;
};
