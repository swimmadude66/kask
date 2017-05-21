import * as express from 'express';

module.exports = (APP_CONFIG) => {
    const router = express.Router();
    const db = APP_CONFIG.database;

    router.get('/pours', (req, res) => {
        let now = new Date();
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        let fromDate = req.query.fromDate ? req.query.fromDate : getDateString(sevenDaysAgo, false);
        let toDate = req.query.toDate ? req.query.toDate : getDateString(now, true);

        console.log(req.query, fromDate, toDate);

        db.getPours(fromDate, toDate).subscribe(
            pours => res.send({Pours: pours}),
            err => res.status(500).send('Could not retrieve pour history')
        );
    });

    return router;
};

function getDateString(date: Date, upperBound: boolean): string {
    let month = date.getMonth() + 1;
    let day =  date.getDate();

    let str = `${date.getFullYear()}-${pad(month)}-${pad(day)}`;

    if (upperBound) {
        str += `T11:59:59`;
    }

    return str;
}

function pad(num: number): string {
    if (num > 9) {
        return '' + num;
    }
    return '0' + num;
}
