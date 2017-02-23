import { Beer } from './beer.model';
import { KegSize } from './keg_size.model';
export * from './tap.model';
export * from './beer.model';
export * from './style.model';
export * from './brewery.model';
export * from './location.model';
export * from './keg_size.model';

export type Keg = Beer & {Size: KegSize};
