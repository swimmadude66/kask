import {Observable} from 'rxjs/Rx';
import {Beer, Brewery, Style, Database} from '../models';
import {createPool, IPoolConfig, Pool} from 'mysql';

export class MysqlDatabase implements Database {

    private pool: Pool;

    constructor(config?: IPoolConfig) {
        let poolconfig = Object.assign({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_DATABASE || 'ontap',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'admin'
        }, config || {});

        this.pool = createPool(poolconfig);
    }

    public saveBeer(beer: Beer): Observable<number> {
        return Observable.create(observer => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error(err);
                    return observer.error('Error connecting to database');
                }
                let params = {...beer, StyleId: -1, BreweryId: -1};
                params.StyleId = beer.Style.StyleId;
                params.BreweryId = beer.Brewery.BreweryId;
                delete params.Style;
                delete params.Brewery;
                let q = 'Insert into `beers` SET ? ON DUPLICATE KEY Update `BeerId`=LAST_INSERT_ID(`BeerId`);';
                conn.query(q, params, (error, result) => {
                    if (error) {
                        console.log(JSON.stringify(beer, null, 4));
                        console.error(error);
                        return observer.error('Error saving beer to database');
                    }
                    observer.next(result.insertId);
                    observer.complete();
                    conn.release();
                });
            });
        });
    }

    public saveStyle(style: Style): Observable<number> {
        return Observable.create(observer => {
             this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error(err);
                    return observer.error('Error connecting to database');
                }
                let q = 'Insert into `styles` SET ? ON DUPLICATE KEY Update `StyleId`=LAST_INSERT_ID(`StyleId`);';
                conn.query(q, style, (error, result) => {
                    if (error) {
                        console.log(JSON.stringify(style, null, 4));
                        console.error(error);
                        return observer.error('Error saving style to database');
                    }
                    observer.next(result.insertId);
                    observer.complete();
                    conn.release();
                });
             });
        });
    }

    public saveBrewery(brewery: Brewery): Observable<number> {
        return Observable.create(observer => {
             this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error(err);
                    return observer.error('Error connecting to database');
                }
                let q = 'Insert into `breweries` SET ? ON DUPLICATE KEY Update `BreweryId`=LAST_INSERT_ID(`BreweryId`);';
                conn.query(q, brewery, (error, result) => {
                    if (error) {
                        console.log(JSON.stringify(brewery, null, 4));
                        console.error(error);
                        return observer.error('Error saving brewery to database');
                    }
                    observer.next(result.insertId);
                    observer.complete();
                    conn.release();
                });
             });
        });
    }
}
