import {Observable} from 'rxjs/Rx';
import {createPool, IPoolConfig, Pool} from 'mysql';
import {
    Beer,
    Brewery,
    Style,
    Database,
    Tap,
    Location,
    KegSize,
    Keg
} from '../models';

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

    private mapKegs(results: any[]): Keg[] {
        return results
        .map(result => this.mapKeg(result));
    }

    private mapKeg(result: any): Keg {
        let keg: Keg = {
            BeerId: result.BeerId,
            BDBID: result.BeerBDBID,
            Brewery: this.mapBrewery(result),
            Style: this.mapStyle(result),
            Name: result.BeerName,
            Description: result.BeerDescription,
            ABV: result.ABV,
            IBU: result.IBU,
            LabelUrl: result.LabelUrl,
            Size: result.KegSize
        };
        return keg;
    }

    private mapStyle(result: any): Style {
        let style: Style = {
            StyleId: result.StyleId,
            BDBID: result.StyleBDBID,
            Name: result.StyleName,
            Description: result.StyleDescription,
            ABVMin: result.ABVMin,
            ABVMax: result.ABVMax,
            IBUMin: result.IBUMin,
            IBUMax: result.IBUMax,
            SRMMin: result.SRMMin,
            SRMMax: result.SRMMax
        };
        return style;
    }

    private mapBrewery(result: any): Brewery {
        let brewery: Brewery = {
            BreweryId: result.BreweryId,
            BDBID: result.BreweryBDBID,
            BreweryName: result.BreweryName,
            Description: result.BreweryDescription,
            Established: result.Established,
            Image: result.Image,
            Website: result.Website
        };
        return brewery;
    }

    saveBeer(beer: Beer): Observable<number> {
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

    saveStyle(style: Style): Observable<number> {
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

    saveBrewery(brewery: Brewery): Observable<number> {
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

    getLocations(): Observable<Location[]> {
        let q = 'Select * from `off_tap_locations`;';
        return this.query(q)
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error getting locations');
            }
        );
    }

    getLocation(locationId: number): Observable<Location> {
        let q = 'Select * from `off_tap_locations` WHERE `LocationId` = ?;';
        return this.query(q, [locationId])
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error getting location');
            }
        );
    }

    addLocation(name: string, description?: string): Observable<number> {
        let q = 'Insert into `off_tap_locations` (`Name`, `Description`) VALUES (?,?);';
        return this.query(q, [name, description])
        .map(
            result => result.insertId,
            error => {
                console.error(error);
                return Observable.throw('Error adding location');
            }
        );
    }

    editLocation(locationId: number, name: string, description?: string): Observable<boolean> {
        let q = 'Update `off_tap_locations` SET `Name`=?, `Description`=? WHERE `LocationId`=?;';
        return this.query(q, [name, description, locationId])
        .map(
            result => !!result,
            error => {
                console.error(error);
                return Observable.throw('Could not update location');
            }
        );
    }

    deleteLocation(locationId: number): Observable<boolean> {
        let q = 'Delete from `off_tap_locations` where `LocationId`=?;';
        return this.query(q, [locationId])
        .map(
            result => !!result,
            error => {
                console.error(error);
                return Observable.throw('Could not delete location');
            }
        );
    }

    getTaps(): Observable<Tap[]> {
        let q = 'Select * from `taps`;';
        return this.query(q)
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error getting taps');
            }
        );
    }

    getTap(tapId: number): Observable<Tap> {
        let q = 'Select * from `taps` WHERE `TapId` = ?;';
        return this.query(q, [tapId])
        .map(
            results => results,
            error => {
                console.error(error);
                return Observable.throw('Error getting tap');
            }
        );
    }

    addTap(name: string, description?: string, status?: string): Observable<number> {
        let q = 'Insert into `taps` (`TapName`, `Description`, `Status`) VALUES (?,?,?);';
        return this.query(q, [name, description, status])
        .map(
            result => result.insertId,
            error => {
                console.error(error);
                return Observable.throw('Error adding tap');
            }
        );
    }

    editTap(tapId: number, name: string, description?: string, status?: string): Observable<boolean> {
        let q = 'Update `taps` SET `TapName`=?, `Description`=?, `Status`=? WHERE `TapId`=?;';
        return this.query(q, [name, description, status, tapId])
        .map(
            result => !!result,
            error => {
                console.error(error);
                return Observable.throw('Could not update tap');
            }
        );
    }

    deleteTap(tapId: number): Observable<boolean> {
        let q = 'Delete from `taps` where `TapId`=?;';
        return this.query(q, [tapId])
        .map(
            result => !!result,
            error => {
                console.error(error);
                return Observable.throw('Could not delete tap');
            }
        );
    }

    assignBeerToLocation(beerId: number, locationId: number, size?: KegSize): Observable<boolean> {
        let q = 'Insert into `off_tap_kegs` (`LocationId`, `BeerId`, `KegSize`) VALUES (?, ?, ?);';
        return this.query(q, [locationId, beerId, size])
        .map(results => !!results);
    }

    moveKegLocation(kegId: number, newLocationId: number): Observable<boolean> {
        let q = 'Update `off_tap_kegs` SET `LocationId` = ? WHERE `KegId` = ?;';
        return this.query(q, [newLocationId, kegId])
        .map(results => !!results);
    }

    tapKeg(kegId: number, tapId: number): Observable<number> {
        let q = 'Select `BeerId`, `KegSize` from `off_tap_kegs` WHERE `KegId` = ? LIMIT 1;';
        return this.query(q, [kegId])
        .map(results => {
            if (results.length < 1) {
                return Observable.throw('Could not locate keg');
            } else {
                return results;
            }
        })
        .flatMap(
            results => this.tapBeer(results[0].BeerId, tapId, results[0].KegSize)
        )
        .flatMap(result => {
            let update_q = 'Update `off_tap_kegs` SET `Active`=0 WHERE `KegId` = ?;';
            return this.query(update_q, [kegId]).map(_ => result);
        })
        .map(
            _ => _,
            err => {
                console.error(err);
                return Observable.throw('Could not tap keg');
            }
        );
    }

    tapBeer(beerId: number, tapId: number, size?: KegSize): Observable<number> {
        return Observable.create(observer => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error(err);
                    return observer.error('Could not establish connection to the database');
                }
                conn.beginTransaction(trans_err => {
                    if (trans_err) {
                        conn.release();
                        console.error(trans_err);
                        return observer.error('Failed to tap keg!');
                    }
                    let update_q = 'Update `beer_sessions` SET `Active`=0, `RemovalTime`=CURRENT_TIMESTAMP WHERE `TapId`=?;';
                    conn.query(update_q, [tapId], (error, result) => {
                        if (error) {
                            conn.release();
                            console.error(error);
                            return observer.error('Could not change active beer on tap');
                        }
                        let insert_q = 'Insert into `beer_sessions` (`TapId`, `BeerId`, `KegSize`) VALUES (?, ?, ?);';
                        conn.query(insert_q, [tapId, beerId, size], (insert_err, insert_result) => {
                            if (insert_err) {
                                conn.release();
                                console.error(error);
                                return observer.error('Could not change active beer on tap');
                            }
                            conn.commit(commit_err => {
                                if (commit_err) {
                                    return conn.rollback(() => {
                                        conn.release();
                                        console.error(commit_err);
                                        return observer.error('Could not change active beer on tap');
                                    });
                                }
                                conn.release();
                                observer.next(insert_result.insertId);
                                return observer.complete();
                            });
                        });
                    });
                });
            });
        });
    }

    emptyTap(tapId: number): Observable<boolean> {
        let q = 'Update `beer_sessions` SET `Active`=0 WHERE `TapId`=?;';
        return this.query(q, [tapId])
        .map(
            result => !!result,
            error => {
                console.error(error);
                return Observable.throw('Could not untap keg!');
            }
        );
    }

    getLocationContents(locationId: number): Observable<Keg[]> {
        let q = 'Select ' +
            '`beers`.`Name` as BeerName, `beers`.`Description` as BeerDescription, `beers`.`BDBID` as BeerBDBID, `beers`.*, ' +
            '`breweries`.`Description` as BreweryDescription, `breweries`.`BDBID` as BreweryBDBID, `breweries`.*, ' +
            '`styles`.`Name` as StyleName, `styles`.`Description` as StyleDescription, `styles`.`BDBID` as StyleDBID, `styles`.*, ' +
            '`off_tap_kegs`.`KegSize` ' +
            'from `off_tap_kegs` ' +
            'join `beers` on `off_tap_kegs`.`BeerId`=`beers`.`BeerId` ' +
            'join `breweries` on `beers`.`BreweryId`=`breweries`.`BreweryId` ' +
            'join  `styles` on `beers`.`StyleId`=`styles`.`StyleId` ' +
            'where `off_tap_kegs`.`Active`=1 AND `LocationId`=?;';
        return this.query(q, [locationId])
        .map(
            results => this.mapKegs(results),
            err => {
                console.error(err);
                return Observable.throw('Could not get contents of location');
            }
        );
    }

    getTapContents(tapId: number): Observable<Keg> {
        let q = 'Select ' +
            '`beers`.`Name` as BeerName, `beers`.`Description` as BeerDescription, `beers`.`BDBID` as BeerBDBID, `beers`.*, ' +
            '`breweries`.`Description` as BreweryDescription, `breweries`.`BDBID` as BreweryBDBID, `breweries`.*, ' +
            '`styles`.`Name` as StyleName, `styles`.`Description` as StyleDescription, `styles`.`BDBID` as StyleDBID, `styles`.*, ' +
            '`beer_sessions`.`KegSize` ' +
            'from `beer_sessions` ' +
            'join `beers` on `beer_sessions`.`BeerId`=`beers`.`BeerId` ' +
            'join `breweries` on `beers`.`BreweryId`=`breweries`.`BreweryId` ' +
            'join  `styles` on `beers`.`StyleId`=`styles`.`StyleId` ' +
            'where `beer_sessions`.`Active`=1 AND `TapId`=?;';
        return this.query(q, [tapId])
        .map(
            results => results.length > 0 ? this.mapKeg(results[0]) : null,
            err => {
                console.error(err);
                return Observable.throw('Could not get contents of location');
            }
        );
    }
}
