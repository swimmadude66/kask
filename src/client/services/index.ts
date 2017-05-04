import {TapService} from './tap.service';
import {LocationService} from './location.service';
import {BeerService} from "./beer.service";

export const ALL_PROVIDERS = [
    TapService,
    LocationService,
    BeerService
];

export {
    TapService,
    LocationService,
    BeerService
};
