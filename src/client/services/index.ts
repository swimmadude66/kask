import {TapService} from './tap.service';
import {LocationService} from './location.service';
import {BeerService} from './beer.service';
import {AuthService} from './auth.service';
import {AdminService} from './admin.service';
import {StatsService} from './stats.service';
import {SocketService} from './sockets.service';
import { PollService } from './polls.service';

export const ALL_PROVIDERS = [
    TapService,
    LocationService,
    BeerService,
    AuthService,
    AdminService,
    StatsService,
    SocketService,
    PollService
];

export {
    TapService,
    LocationService,
    BeerService,
    AuthService,
    AdminService,
    StatsService,
    SocketService,
    PollService
};
