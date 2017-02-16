import {Observable} from 'rxjs/Rx';
import {Style} from './style.model';
import {Brewery} from './brewery.model';
import {Location} from './location.model';
import {Beer} from './beer.model';
import {Tap} from './tap.model';
import {KegSize} from './keg_size.model';

export type Keg = Beer & {Size?: KegSize};

export interface Database {
    // Admin methods for saving data from searches
    saveBeer(beer: Beer): Observable<number>;
    saveStyle(style: Style): Observable<number>;
    saveBrewery(brewery: Brewery): Observable<number>;

    // retrieve data from previous searches
    getStyles(): Observable<Style[]>;
    getStyle(styleId: number): Observable<Style & {Beers: Beer[]}>;
    getBreweries(): Observable<Brewery[]>;
    getBrewery(breweryId: number): Observable<Brewery & {Beers: Beer[]}>;
    getBeers(): Observable<Beer[]>;
    getBeer(styleId: number): Observable<Beer>;

    // work with storage locations
    getLocations(): Observable<Location[]>;
    getLocation(locationId: number): Observable<Location & {Beers: Beer[]}>;
    addLocation(name: string, description?: string): Observable<number>;
    editLocation(locationId: number, name: string, description?: string): Observable<boolean>;
    deleteLocation(locationId: number): Observable<boolean>;

    // taps operations
    getTaps(): Observable<Tap[]>;
    getTap(tapId: number): Observable<Tap>;
    addTap(name: string, description?: string, status?: string): Observable<number>;
    editTap(tapId: number, name: string, description?: string, status?: string): Observable<boolean>;
    deleteTap(tapId: number): Observable<boolean>;

    // Get Contents
    getLocationContents(locationId: number): Observable<Keg[]>;
    getTapContents(locationId: number): Observable<Keg>;

    // beer movement
    // -----------------
    // Assign a beer from db to a storage location
    assignBeerToLocation(beerId: number, locationId: number, size?: KegSize): Observable<boolean>;
    // move a keg from one storage location to another
    moveKegLocation(kegId: number, newLocationId: number): Observable<boolean>;
    // move a keg from storage location to tap
    tapKeg(kegId: number, tapId: number): Observable<number>;
    // tap a beer without adding it to storage (straight from supplier?)
    tapBeer(beerId: number, tapId: number, size?: KegSize): Observable<number>;
    // remove keg from tap without replacing it with another keg (gasp!) only in a beer emergency
    emptyTap(tapId: number): Observable<boolean>;
}
