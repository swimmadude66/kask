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

    private query (q, params?): Observable<any> {
        return Observable.create(observer => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    return observer.error(err);
                }
                conn.query(q, params || [], (error, result) => {
                    if (error) {
                        return observer.error(error);
                    }
                        observer.next(result);
                        observer.complete();
                        conn.release();
                });
            });
        });
    }

    public saveBeer(beer: Beer): Observable<number> {
        let q = 'Insert into `beers` SET ? ON DUPLICATE KEY Update `BeerId`=LAST_INSERT_ID(`BeerId`);';
        let params = {...beer, StyleId: -1, BreweryId: -1};
        params.StyleId = beer.Style.StyleId;
        params.BreweryId = beer.Brewery.BreweryId;
        delete params.Style;
        delete params.Brewery;
        return this.query(q, params)
        .map(
            results => results.insertId,
            err => {
                console.error(err);
                return Observable.throw('Error saving beer to database');
            }
        );
    }

    public saveStyle(style: Style): Observable<number> {
        let q = 'Insert into `styles` SET ? ON DUPLICATE KEY Update `StyleId`=LAST_INSERT_ID(`StyleId`);';
        return this.query(q, style)
        .map(
            results => results.insertId,
            err => {
                console.error(err);
                return Observable.throw('Error saving style to database');
            }
        );
    }

    public saveBrewery(brewery: Brewery): Observable<number> {
        let q = 'Insert into `breweries` SET ? ON DUPLICATE KEY Update `BreweryId`=LAST_INSERT_ID(`BreweryId`);';
        return this.query(q, brewery)
        .map(
            results => results.insertId,
            err => {
                console.error(err);
                return Observable.throw('Error saving brewery to database');
            }
        );
    }

    getStyles(): Observable<Style[]> {
        let q = 'Select * from `styles`;';
        return this.query(q)
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error retrieving styles');
            }
        );
    }

    getStyle(styleId: number): Observable<Style> {
        let q = 'Select * from `styles` WHERE `StyleId` = ?;';
        return this.query(q, [styleId])
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error retrieving style');
            }
        );
    }

    getBreweries(): Observable<Brewery[]> {
        let q = 'Select * from `breweries`;';
        return this.query(q)
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error retrieving breweries');
            }
        );
    }

    getBrewery(breweryId: number): Observable<Brewery> {
        let q = 'Select * from `breweries` WHERE `BreweryId` = ?;';
        return this.query(q, [breweryId])
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error retrieving brewery');
            }
        );
    }

    getBeers(): Observable<Beer[]> {
        let q = 'Select * from `beers`;';
        return this.query(q)
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error retrieving beers');
            }
        );
    }

    getBeer(beerId: number): Observable<Beer> {
        let q = 'Select * from `beers` WHERE `BeerId` = ?;';
        return this.query(q, [beerId])
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error retrieving beer');
            }
        );
    }
}
