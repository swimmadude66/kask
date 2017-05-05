import {TapService} from './tap.service';
import {LocationService} from './location.service';
import {BeerService} from "./beer.service";
import {AuthService} from "./auth.service";

export const ALL_PROVIDERS = [
    TapService,
    LocationService,
    BeerService,
    AuthService
];

export {
    TapService,
    LocationService,
    BeerService,
    AuthService
};
