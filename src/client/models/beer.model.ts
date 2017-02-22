import {Style} from './style.model';
import {Brewery} from './brewery.model';

export class Beer {
    BeerId?: number;
    BeerName: string;
    BeerDescription: string;
    ABV: number;
    IBU: number;
    LabelUrl: string;
    Style: Style;
    Brewery: Brewery;
    BeerBDBID: string;
}
