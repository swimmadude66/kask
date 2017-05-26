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

    private mapResponseToStyle(styleInfo): Style {
        let style: Style = {
            StyleBDBID: styleInfo.id,
            StyleName: styleInfo.name,
            StyleDescription: styleInfo.description,
            SRMMin: (styleInfo && styleInfo.srmMin && NUMBER_REGEX.test(styleInfo.srmMin)) ? +styleInfo.srmMin : undefined,
            SRMMax: (styleInfo && styleInfo.srmMax && NUMBER_REGEX.test(styleInfo.srmMax)) ? +styleInfo.srmMax : undefined,
            IBUMin: (styleInfo && styleInfo.ibuMin && NUMBER_REGEX.test(styleInfo.ibuMin)) ? +styleInfo.ibuMin : undefined,
            IBUMax: (styleInfo && styleInfo.ibuMax && NUMBER_REGEX.test(styleInfo.ibuMax)) ? +styleInfo.ibuMax : undefined,
            ABVMin: (styleInfo && styleInfo.abvMin && NUMBER_REGEX.test(styleInfo.abvMin)) ? +styleInfo.abvMin : undefined,
            ABVMax: (styleInfo && styleInfo.abvMax && NUMBER_REGEX.test(styleInfo.abvMax)) ? +styleInfo.abvMax : undefined
        };
        return style;
    }

    private mapResponseToBrewery(breweryInfo): Brewery {
        let brewery: Brewery = {
            BreweryBDBID: breweryInfo.id,
            BreweryName: breweryInfo.name,
            BreweryDescription: breweryInfo.description,
            Website: breweryInfo.website,
            Established: breweryInfo.established,
            Image: (breweryInfo && breweryInfo.images && breweryInfo.images.large) ? breweryInfo.images.large : undefined
        };
        return brewery;
    }

    private mapResponseToBeer(beerInfo, style, brewery): Beer {
        let beer: Beer = {
            BeerBDBID: beerInfo.id,
            BeerName: beerInfo.name,
            BeerDescription: beerInfo.description,
            ABV: (beerInfo && beerInfo.abv && NUMBER_REGEX.test(beerInfo.abv)) ? +beerInfo.abv : undefined,
            IBU: (beerInfo && beerInfo.ibu && NUMBER_REGEX.test(beerInfo.ibu)) ? +beerInfo.ibu : undefined,
            LabelUrl: (beerInfo && beerInfo.labels && beerInfo.labels.large) ? beerInfo.labels.large : undefined,
            LabelScalingFactor: 100,
            LabelOffsetX: 0,
            LabelOffsetY: 0,
            Style: style,
            Brewery: brewery
        };
        return beer;
    }

    searchForBeer(query: string): Observable<Beer[]> {
        let searchUrl = `${BASEURL}/search?key=${this.APIKEY}&withBreweries=Y&type=beer&q=${query}&p=1`;
        return request.get(searchUrl)
        .map(data => JSON.parse(data.body))
        .flatMap(response => {
            if (!response) {
                return Observable.throw('No Response!');
            }
            if (!response.data || response.data.length < 1) {
                return Observable.of([]);
            }
            let styles = [];
            let breweries = [];
            let beers = response.data.map(
                b => {
                    if (!b) {
                        return Observable.throw('Missing Beer Info');
                    } else if (!b.breweries || b.breweries.length < 1) {
                        b.breweries = [
                            {
                                id: 'unknownbrewery',
                                name: 'Unknown Brewery',
                                description: 'Brewery DB does not have a brewery mapping for this beer'
                            }
                        ];
                    } else if (!b.style) {
                        b.style = {
                            id: 'unkownstyle',
                            name: 'Unknown',
                            description: 'BreweryDB does not have a style mapping for this beer'
                        };
                    }
                    if (styles.every(s => s.StyleBDBID !== b.style.id)) {
                        styles.push(this.mapResponseToStyle(b.style));
                    }
                    if (breweries.every(br => br.BreweryBDBID !== b.breweries[0].id)) {
                        breweries.push(this.mapResponseToBrewery(b.breweries[0]));
                    }
                    return b;
                }
            );

            return Observable.forkJoin(
                this._database.saveStyles(styles),
                this._database.saveBreweries(breweries)
            )
            .flatMap(results => {
                let saved_styles = results[0];
                let saved_breweries = results[1];
                let clean_beers = beers.map((beer: any) => {
                    let style = saved_styles[beer.style.id + ''];
                    let brewery = saved_breweries[beer.breweries[0].id];
                    let clean_beer = this.mapResponseToBeer(beer, style, brewery);
                    return clean_beer;
                });
                return this._database.saveBeers(clean_beers);
            });
        });
    }

    saveBeerInfo(beerInfo): Observable<Beer> {
        return this._database.saveBeer(beerInfo)
        .map(id => {
            beerInfo.BeerId = id;
            return beerInfo;
        });
    }

    saveStyle(styleInfo): Observable<Style> {
        let style = this.mapResponseToStyle(styleInfo);
        return this._database.saveStyle(style)
        .map(id => {
            style.StyleId = id;
            return style;
        });
    }

    saveBrewery(breweryInfo): Observable<Brewery> {
        let brewery = this.mapResponseToBrewery(breweryInfo);
        return this._database.saveBrewery(brewery)
        .map(id => {
            brewery.BreweryId = id;
            return brewery;
        });
    }

}
