import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/', (req, res) => {
        let userId = 0;
        let isAdmin = false;
        if (res.locals && res.locals.user) {
            userId = res.locals.user.UserId;
            isAdmin = res.locals.user.IsAdmin;
        }

        db.getOrders(userId, isAdmin).subscribe(
            orders => res.send({Orders: orders}),
            err => res.status(500).send('Could not retrieve orders')
        );
    });

    router.get('/:orderId', (req, res) => {
        let userId = 0;
        if (res.locals && res.locals.user) {
            userId = res.locals.user.UserId;
        }

        db.getOrder(userId, req.params.orderId).subscribe(
            order => res.send({Order: order}),
            err => res.status(500).send('Could not retrieve order')
        );
    });

    return router;
};
