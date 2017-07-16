import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { OrderService } from '../../services/orders.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import {Location} from '../../models/location.model';
@Component({
    selector: 'orders',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private ordersSubscription: Subscription;

    orders: Order[];
    locations: Location[];

    isAdmin: boolean = false;
    isLoggedIn: boolean = false;
    isAddingOrder: boolean = false;

    constructor(
        private orderService: OrderService,
        private authService: AuthService,
        private locationService: LocationService
    ) { }

    addOrder(order) {
        this.isAddingOrder = false;

        this.ordersSubscription.unsubscribe();

        this.ordersSubscription = this.orderService.createOrder(order.title, order.description, order.votesPerUser)
            .flatMap(_ => this.orderService.getOrders())
            .do(activeOrders => this.orders = activeOrders.filter(o => !!o))
            .flatMap(orders => Observable.combineLatest(orders.map(o => this.orderService.observe(o.OrderId, o))))
            .subscribe(latestOrders => this.orders = latestOrders.filter(o => !!o));
    }

    ngOnInit() {
        this.authService.isLoggedIn().subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
        this.authService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);

        this.locationService.getLocations().subscribe(locations => this.locations = locations);

        this.ordersSubscription = this.orderService.getOrders()
            .do(activeOrders => this.orders = activeOrders.filter(o => !!o))
            .flatMap(orders => Observable.combineLatest(orders.map(o => this.orderService.observe(o.OrderId, o))))
            .subscribe(latestOrders => this.orders = latestOrders.filter(o => !!o));

        this.subscriptions.push(this.ordersSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
