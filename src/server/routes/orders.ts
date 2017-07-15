import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/', (req, res) => {
        let userId = 0;
        if (res.locals && res.locals.user) {
            userId = res.locals.user.UserId;
        }

        db.getOrders(userId, res.locals.user.IsAdmin).subscribe(
            orders => res.send({Orders: orders}),
            err => res.status(500).send('Could not retrieve orders')
        );
    });

    router.get('/:orderId', (req, res) => {
        db.getOrder(req.params.orderId).subscribe(
            order => res.send({Order: order}),
            err => res.status(500).send('Could not retrieve order')
        );
    });

    return router;
};
