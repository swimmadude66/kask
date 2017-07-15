import { Beer } from './';
import { KegSize } from './';

export class OrderBeer {
    OrderBeerId: number;
    Beer: Beer;
    Size?: KegSize;
}
