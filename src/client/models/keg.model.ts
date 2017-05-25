import {Beer} from './beer.model';

export enum KegSize {
    Sixth_Barrel = <any>'1/6',
    Quarter_Barrel = <any>'1/4',
    Half_Barrel = <any>'1/2'
}

export class Keg {
    KegId: number;
    Beer: Beer;
    Size: KegSize;
    InitialVolume: number;
    RemovedVolume: number;
    TapId?: number;
    LocationId?: number;
}
