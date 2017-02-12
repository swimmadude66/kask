import {Beer, Style, Brewery, Database} from '../models';
import {Observable} from 'rxjs/Rx';
import {RxHttpRequest} from 'rx-http-request';
const request = RxHttpRequest;

const BASEURL = 'http://api.brewerydb.com/v2';
const NUMBER_REGEX = /^\d*\.?\d*$/;

export class BreweryDBService {
    private APIKEY: string;
    constructor(
        private apikey: string,
        private _database: Database
    ) {
        this.APIKEY = apikey;
        if (!this.APIKEY) {
            console.error('Brewery DB API Key is required to run OnTap!');
            process.exit(1);
        }
    }

    searchForBeer(query: string): Observable<Beer[]> {
        let searchUrl = `${BASEURL}/search?key=${this.APIKEY}&withBreweries=Y&type=beer&q=${query}&p=1`;
        return request.get(searchUrl)
        .map(data => JSON.parse(data.body))
        .flatMap(response => {
            if (!response || !response.data || response.data.length < 1) {
                return Observable.throw('No Results!');
            }
            let beers = response.data;
            return Observable.from(beers)
            .flatMap(beer => this.saveBeerInfo(beer)
                .catch(err => {
                    console.log(err);
                    return Observable.of(false);
                })
            )
            .filter(beer => !!beer)
            .toArray();
        });
    }

    saveBeerInfo(beerInfo): Observable<Beer> {
        if (!beerInfo) {
            return Observable.throw('Missing Beer Info');
        } else if (!beerInfo.breweries || beerInfo.breweries.length < 1) {
            beerInfo.breweries = [
                {
                    id: 'unknownbrewery',
                    name: 'Unknown Brewery',
                    description: 'Brewery DB does not have a brewery mapping for this beer'
                }
            ];
        } else if (!beerInfo.style) {
            beerInfo.style = {
                id: 'unkownstyle',
                name: 'Unknown',
                description: 'BreweryDB does not have a style mapping for this beer'
            };
        }
        return Observable.forkJoin(
            this.saveStyle(beerInfo.style),
            this.saveBrewery(beerInfo.breweries[0])
        ).map(
            results => {
                let style = results[0];
                let brewery = results[1];
                let beerModel: Beer = {
                    BDBID: beerInfo.id,
                    Name: beerInfo.name,
                    Description: beerInfo.description,
                    ABV: (beerInfo && beerInfo.abv && NUMBER_REGEX.test(beerInfo.abv)) ? +beerInfo.abv : undefined,
                    IBU: (beerInfo && beerInfo.ibu && NUMBER_REGEX.test(beerInfo.ibu)) ? +beerInfo.ibu : undefined,
                    LabelUrl: (beerInfo && beerInfo.labels && beerInfo.labels.large) ? beerInfo.labels.large : undefined,
                    Style: style,
                    Brewery: brewery
                };
                return beerModel;
            }
        ).flatMap(model => {
            return this._database.saveBeer(model)
                .map(id => {
                    model.BeerId = id;
                    return model;
                });
        });
    }

    saveStyle(styleInfo): Observable<Style> {
        let style: Style = {
            BDBID: styleInfo.id,
            Name: styleInfo.name,
            Description: styleInfo.description,
            SRMMin: (styleInfo && styleInfo.srmMin && NUMBER_REGEX.test(styleInfo.srmMin)) ? +styleInfo.srmMin : undefined,
            SRMMax: (styleInfo && styleInfo.srmMax && NUMBER_REGEX.test(styleInfo.srmMax)) ? +styleInfo.srmMax : undefined,
            IBUMin: (styleInfo && styleInfo.ibuMin && NUMBER_REGEX.test(styleInfo.ibuMin)) ? +styleInfo.ibuMin : undefined,
            IBUMax: (styleInfo && styleInfo.ibuMax && NUMBER_REGEX.test(styleInfo.ibuMax)) ? +styleInfo.ibuMax : undefined,
            ABVMin: (styleInfo && styleInfo.abvMin && NUMBER_REGEX.test(styleInfo.abvMin)) ? +styleInfo.abvMin : undefined,
            ABVMax: (styleInfo && styleInfo.abvMax && NUMBER_REGEX.test(styleInfo.abvMax)) ? +styleInfo.abvMax : undefined
        };

        return this._database.saveStyle(style)
        .map(id => {
            style.StyleId = id;
            return style;
        });
    }

    saveBrewery(breweryInfo): Observable<Brewery> {
        let brewery: Brewery = {
            BDBID: breweryInfo.id,
            BreweryName: breweryInfo.name,
            Description: breweryInfo.description,
            Website: breweryInfo.website,
            Established: breweryInfo.established,
            Image: (breweryInfo && breweryInfo.images && breweryInfo.images.large) ? breweryInfo.images.large : undefined
        };

        return this._database.saveBrewery(brewery)
        .map(id => {
            brewery.BreweryId = id;
            return brewery;
        });
    }

}
