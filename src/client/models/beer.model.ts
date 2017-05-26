import {Style} from './style.model';
import {Brewery} from './brewery.model';

export class Beer {
    BeerId?: number;
    BeerName: string;
    BeerDescription: string;
    ABV: number;
    IBU: number;
    LabelUrl: string;
    LabelScalingFactor: number;
    LabelOffsetX: number;
    LabelOffsetY: number;
    Style: Style;
    Brewery: Brewery;
    BeerBDBID: string;
}
