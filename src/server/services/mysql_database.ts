import {Observable} from 'rxjs/Rx';
import {createPool, IPoolConfig, Pool, escape} from 'mysql';
import {
    Beer,
    Brewery,
    Style,
    Database,
    Tap,
    Location,
    KegSize,
    Keg,
    BeerSession
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
                        console.error('DATABASE ERROR', error);
                        return observer.error(error);
                    }
                    observer.next(result);
                    observer.complete();
                    conn.release();
                });
            });
        });
    }

    private mapBeerSession(result: any): BeerSession {
        let session: BeerSession = {
            SessionId: result.SessionId,
            NetVote: result.NetVote,
            UserVote: result.UserVote,
            TapId: result.TapId,
            Keg: this.mapKeg(result)
        };
        return session;
    }

    private mapKeg(result: any): Keg {
        let gallons = 15.5;
        let mlPerGallon = 3785;
        if ('Size' in result) {
            if (result.Size === '1/2') {
                gallons = 15.5;
            } else if (result.Size === '1/4') {
                gallons = 7.75;
            } else {
                gallons = 5.16;
            }
        }
        let initialVolume = gallons * mlPerGallon;
        let keg: Keg = {
            KegId: result.KegId,
            Beer: this.mapBeer(result),
            Size: result.Size,
            InitialVolume: initialVolume,
            RemovedVolume: result.RemovedVolume || 0,
        };
        return keg;
    }

    private mapBeer(result: any): Beer {
        let beer: Beer = {
            BeerId: result.BeerId,
            BeerBDBID: result.BeerBDBID,
            Brewery: this.mapBrewery(result),
            Style: this.mapStyle(result),
            BeerName: result.BeerName,
            BeerDescription: result.BeerDescription,
            ABV: result.ABV,
            IBU: result.IBU,
            LabelUrl: result.LabelUrl,
            LabelScalingFactor: result.LabelScalingFactor
        };
        return beer;
    }

    private mapStyle(result: any): Style {
        let style: Style = {
            StyleId: result.StyleId,
            StyleBDBID: result.StyleBDBID,
            StyleName: result.StyleName,
            StyleDescription: result.StyleDescription,
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
            BreweryBDBID: result.BreweryBDBID,
            BreweryName: result.BreweryName,
            BreweryDescription: result.BreweryDescription,
            Established: result.Established,
            Image: result.Image,
            Website: result.Website
        };
        return brewery;
    }

    registerUser(username: string, salt: string, passHash: string): Observable<number> {
        let q = 'Insert into `users` (`Email`, `Salt`, `PasswordHash`) VALUES (?, ?, ?);';
        let params = [username, salt, passHash];
        return this.query(q, params)
        .map(
            result => result.insertId,
            err => {
                console.error(err);
                return Observable.throw('Could not register new user');
            }
        );
    }

    getPasswordInfo(username: string): Observable<any> {
        let q = 'Select * from `users` where `Email` = ? And `Active`=1 Limit 1;';
        let params = [username];
        return this.query(q, params)
        .map(
            results => {
                if (results.length < 1) {
                    console.log(`User ${username} could not be found`);
                    return Observable.throw('Error logging in');
                }
                return results[0];
            }, err => {
                console.error(err);
                return Observable.throw('Could not look up user ' + username);
            }
        );
    }

    generateSession(session: string, userId: number): Observable<string> {
        let q = 'Insert into `sessions` (`SessionId`, `UserId`) VALUES(?,?);';
        let params = [session, userId];
        return this.query(q, params).map(_ => session);
    }

    getUserInfoBySession(session: string): Observable<any> {
        let q = 'Select `users`.* from `sessions`'
        + ' join `users` on `users`.`UserId` = `sessions`.`UserId`'
        + ' where `SessionId` = ? AND `sessions`.`Active`=1 AND `users`.`Active`=1'
        + ' Limit 1;';
        let params = [session];
        return this.query(q, params)
        .map(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('No found users');
                }
                return results[0];
            },
            err => {
                console.error(err);
                return Observable.throw('Error getting user by session');
            }
        );
    }

    invalidateSession(session: string): Observable<any> {
        let q = 'Update `sessions` Set `Active`=0 Where `SessionId` = ?;';
        let params = [session];
        return this.query(q, params);
    }

    saveBeer(beer: Beer): Observable<number> {
        let q = 'Insert into `beers` SET ? ON DUPLICATE KEY Update `BeerId`=LAST_INSERT_ID(`BeerId`);';
        let params = {...beer, StyleId: beer.Style.StyleId, BreweryId: beer.Brewery.BreweryId};
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

    saveBeers(beers: Beer[]): Observable<Beer[]> {
        let insert_args = beers.map(b => {
            return [b.BeerName, b.BeerDescription, b.Style.StyleId, b.Brewery.BreweryId, b.ABV, b.IBU, b.LabelUrl, b.BeerBDBID];
        });
        let q = 'INSERT INTO `beers` ' +
        '(`BeerName`, `BeerDescription`, `StyleId`, `BreweryId`, `ABV`, `IBU`, `LabelUrl`, `BeerBDBID`) ' +
        'VALUES ' + escape(insert_args) + 'ON DUPLICATE KEY UPDATE `BeerName`=`BeerName`';
        return this.query(q)
        .flatMap(
            _ => {
                let map_q = 'Select * from `beers` ' +
                'join `breweries` on `beers`.`BreweryId`=`breweries`.`BreweryId` ' +
                'join  `styles` on `beers`.`StyleId`=`styles`.`StyleId` ' +
                'where `beers`.`BeerBDBID` in (' + escape(beers.map(b => b.BeerBDBID)) + ');';
                return this.query(map_q)
                .map(results => {
                    return results.map(r => this.mapBeer(r));
                });
            }
        );
    }

    saveBeerLabelScale(beerId: number, scale: number): Observable<any> {
        let q = 'Update `beers` set `LabelScalingFactor`=? Where `BeerId`=?;';
        return this.query(q, [scale, beerId]);
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

    saveStyles(styles: Style[]): Observable<{[BDBID: string]: Style}> {
        let insert_args = styles.map(s => {
            return [s.StyleName, s.StyleDescription, s.SRMMin, s.SRMMax, s.IBUMin, s.IBUMax, s.ABVMin, s.ABVMax, s.StyleBDBID];
        });
        let q = 'INSERT INTO `styles` ' +
        '(`StyleName`, `StyleDescription`, `SRMMin`, `SRMMax`, `IBUMin`, `IBUMax`, `ABVMin`, `ABVMax`, `StyleBDBID`) ' +
        'VALUES ' + escape(insert_args) + ' ON DUPLICATE KEY UPDATE `StyleName`=`StyleName`;';
        return this.query(q).flatMap(
            _ => {
                let map_q = 'Select * from `styles` where `StyleBDBID` in (' + escape(styles.map(s => s.StyleBDBID + '')) + ');';
                return this.query(map_q)
                .map(results => {
                    let styleMap = {};
                    results.forEach(r => {
                        let clean_style = this.mapStyle(r);
                        styleMap[clean_style.StyleBDBID + ''] = clean_style;
                    });
                    return styleMap;
                });
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

    saveBreweries(breweries: Brewery[]): Observable<{[BDBID: string]: Brewery}> {
        let insert_args = breweries.map(b => {
            return [b.BreweryName, b.BreweryDescription, b.Image, b.Established, b.Website, b.BreweryBDBID];
        });
        let q = 'INSERT INTO `breweries` ' +
        '(`BreweryName`, `BreweryDescription`, `Image`, `Established`, `Website`, `BreweryBDBID`) ' +
        'VALUES ' + escape(insert_args) + ' ON DUPLICATE KEY UPDATE `BreweryName` = `BreweryName`;';
        return this.query(q).flatMap(
            _ => {
                let map_q = 'Select * from `breweries` where `BreweryBDBID` in (' + escape(breweries.map(b => b.BreweryBDBID)) + ');';
                return this.query(map_q)
                .map(results => {
                    let breweryMap = {};
                    results.forEach(r => {
                        let clean_brewery = this.mapBrewery(r);
                        breweryMap[clean_brewery.BreweryBDBID] = clean_brewery;
                    });
                    return breweryMap;
                });
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
        let q = 'Select * from `styles` WHERE `StyleId` = ? LIMIT 1;';
        return this.query(q, [styleId])
        .map(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not find style');
                }
                return results[0];
            },
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
        let q = 'Select * from `breweries` WHERE `BreweryId` = ? LIMIT 1;';
        return this.query(q, [breweryId])
        .map(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not find brewery');
                }
                return results[0];
            },
            error => {
                console.error(error);
                return Observable.throw('Error retrieving brewery');
            }
        );
    }

    getBeers(): Observable<Beer[]> {
        let q = 'Select * from `beers`'
        + ' join `styles` on `styles`.`StyleId` = `beers`.`StyleId`'
        + ' join `breweries` on `breweries`.`BreweryId` = `beers`.`BreweryId`';
        return this.query(q)
        .map(
            results => results.map(b => this.mapBeer(b)),
            error => {
                console.error(error);
                return Observable.throw('Error retrieving beers');
            }
        );
    }

    getBeer(beerId: number): Observable<Beer> {
        let q = 'Select * from `beers`'
        + ' join `styles` on `styles`.`StyleId` = `beers`.`StyleId`'
        + ' join `breweries` on `breweries`.`BreweryId` = `beers`.`BreweryId`'
        + ' WHERE `BeerId` = ? Limit 1;';
        return this.query(q, [beerId])
        .map(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not find beer');
                }
                return this.mapBeer(results[0]);
            },
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
        let q = 'Select * from `off_tap_locations` WHERE `LocationId` = ? Limit 1;';
        return this.query(q, [locationId])
        .map(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not find location');
                }
                return results[0];
            },
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
        let q = 'Select * from `taps` WHERE `TapId` = ? Limit 1;';
        return this.query(q, [tapId])
        .map(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not find tap');
                }
                return results[0];
            },
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

    assignBeerToLocation(beerId: number, locationId: number, size: KegSize): Observable<boolean> {
        let q = 'Insert into `kegs` (`BeerId`, `Size`) VALUES(?, ?);';
        return this.query(q, [beerId, size])
        .flatMap(
            result => {
                let q2 = 'Insert into `keg_locations` (`LocationId`, `KegId`) VALUES (?, ?);';
                return this.query(q2, [locationId, result.insertId])
                .map(results => !!results);
            }
        );
    }

    moveKegLocation(kegId: number, newLocationId: number): Observable<boolean> {
        let q = 'Update `keg_locations` SET `LocationId` = ? WHERE `KegId` = ?;';
        return this.query(q, [newLocationId, kegId])
        .map(results => !!results);
    }

    tapBeer(beerId: number, tapId: number, size: KegSize): Observable<number> {
        let q = 'Insert into `kegs` (`BeerId`, `Size`) VALUES(?, ?);';
        return this.query(q, [beerId, size])
        .flatMap(
            result => this.tapKeg(result.insertId, tapId)
        )
        .map(
            _ => _,
            err => {
                console.error(err);
                return Observable.throw('Could not tap beer');
            }
        );
    }

    tapKeg(kegId: number, tapId: number): Observable<number> {
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
                        let insert_q = 'Insert into `beer_sessions` (`TapId`, `KegId`) VALUES (?, ?);';
                        conn.query(insert_q, [tapId, kegId], (insert_err, insert_result) => {
                            if (insert_err) {
                                conn.release();
                                console.error(insert_err);
                                return observer.error('Could not change active beer on tap');
                            }
                            let location_update_q = 'Update `keg_locations` SET `Active`=0 WHERE `KegId` = ?;';
                            conn.query(location_update_q, [kegId], (location_update_err, location_update_result) => {
                                if (location_update_err) {
                                    conn.release();
                                    console.error(location_update_err);
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
        let q = 'Select * from `keg_locations` ' +
            'join `kegs` on `keg_locations`.`KegId`=`kegs`.`KegId` ' +
            'join `beers` on `beers`.`BeerId`=`kegs`.`BeerId` ' +
            'join `breweries` on `beers`.`BreweryId`=`breweries`.`BreweryId` ' +
            'join `styles` on `beers`.`StyleId`=`styles`.`StyleId` ' +
            'where `keg_locations`.`Active`=1 AND `LocationId`=?;';
        return this.query(q, [locationId])
        .map(
            results => results.map(keg => this.mapKeg(keg)),
            err => {
                console.error(err);
                return Observable.throw('Could not get contents of location');
            }
        );
    }

    voteForTap(tapId: number, userId: number, vote: string): Observable<any> {
        let q = 'Select `SessionId` from `beer_sessions` Where `TapId`=? and `Active`=1 LIMIT 1;';
        return this.query(q, [tapId]).flatMap(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not vote for tap');
                }
                let sessionId = results[0].SessionId;
                return this.voteForSession(sessionId, userId, vote);
            }
        );
    }

    voteForSession(sessionId: number, userId: number, vote: string): Observable<any> {
        let q = 'INSERT INTO `beer_session_likes` (`BeerSessionId`, `UserId`, `Vote`)'
        + ' VALUES (?, ?, ?)'
        + ' ON Duplicate Key Update `Vote`=Values(`Vote`);';
        return this.query(q, [sessionId, userId, vote.toLowerCase()]);
    }

    getSessionVotes(sessionId: number, userId?: number): Observable<any[]> {
        let q = 'Select `UserId`, (`Vote`-2) as Vote from `beer_session_likes` Where `BeerSessionId` = ?;';
        return this.query(q, [sessionId])
        .map(
            results => results,
            err => {
                console.error(err);
                return Observable.throw('Could not retrieve votes for beer session');
            }
        );
    }

    getTapContents(tapId: number, userId?: number): Observable<BeerSession> {
        let q = 'Select * from `beer_sessions` ' +
            'join `kegs` on `beer_sessions`.`KegId`=`kegs`.`KegId` ' +
            'join `beers` on `kegs`.`BeerId`=`beers`.`BeerId` ' +
            'join `breweries` on `beers`.`BreweryId`=`breweries`.`BreweryId` ' +
            'join `styles` on `beers`.`StyleId`=`styles`.`StyleId` ' +
            'where `beer_sessions`.`Active`=1 AND `TapId`=? Limit 1;';
        return this.query(q, [tapId])
        .flatMap(
            results => {
                if (!results || results.length < 1) {
                    return Observable.of(null);
                }
                let contents = results[0];
                return this.getSessionVotes(contents.SessionId, userId)
                .map(
                    votes => {
                        let netVote = votes.reduce((previous, current) => {
                            if (current && current.Vote) {
                                return previous + current.Vote;
                            } else {
                                return previous;
                            }
                        }, 0);
                        let userVote = 0;
                        if (userId) {
                            let userVotes = votes.find(v => v.UserId === userId);
                            userVote = userVotes ? userVotes.Vote : 0;
                        }
                        contents.NetVote = netVote;
                        contents.UserVote = userVote;
                        return this.mapBeerSession(contents);
                    }
                );
            })
        .map(
            _ => _,
            err => {
                console.error(err);
                return Observable.throw('Could not get contents of location');
            }
        );
    }

    adjustKegVolume(kegId: number, volume: number, pourtime?: string): Observable<any> {
        let q = 'Update `kegs` set `RemovedVolume` = `RemovedVolume`+? Where `KegId`=?;';
        return this.query(q, [volume, kegId])
        .flatMap(_ => {
            let pourQ = 'Insert into `pours` (`KegId`, `Volume`, `Timestamp`) VALUES (?, ?, ?);';
            return this.query(pourQ, [kegId, volume, pourtime]);
        });
    }

    adjustTapVolume(tapId: number, volume: number, pourtime?: string): Observable<any> {
        let q = 'Select `KegId` from `beer_sessions` Where `TapId`=? And `Active`=1 LIMIT 1;';
        return this.query(q, [tapId])
        .flatMap(
            results => {
                if (!results || results.length < 1) {
                    return Observable.throw('Could not get Keg Id from tap');
                }
                return this.adjustKegVolume(results[0].KegId, volume, pourtime);
            }
        );
    }

    getPours(): Observable<any[]> {
        let q = 'Select `PourId`, `Volume`, `Timestamp`, `TapId` from `pours`' +
        ' join `beer_sessions` on `beer_sessions`.`KegId`=`pours`.`KegId`;';
        return this.query(q);
    }
}
