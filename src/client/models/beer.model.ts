import {Style} from './style.model';
import {Brewery} from './brewery.model';

export class Beer {
    BeerId?: number;
    Name: string;
    Description: string;
    ABV: number;
    IBU: number;
    LabelUrl: string;
    Style: Style;
    Brewery: Brewery;
    BDBID: string;
}
