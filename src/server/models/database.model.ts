import {Observable} from 'rxjs/Rx';
import {Style} from './style.model';
import {Brewery} from './brewery.model';
import {Beer} from './beer.model';

export interface Database {
    saveBeer(beer: Beer): Observable<number>;
    saveStyle(style: Style): Observable<number>;
    saveBrewery(brewery: Brewery): Observable<number>;
}
