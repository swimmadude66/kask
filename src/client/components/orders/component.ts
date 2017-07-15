import { OrderStatus } from '../../../server/models/order.model';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/orders.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
    selector: 'orders',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private ordersSubscription: Subscription;

    orders: Order[];

    isAdmin: boolean = false;
    isLoggedIn: boolean = false;
    isAddingOrder: boolean = false;

    constructor(
        private orderService: OrderService,
        private authService: AuthService
    ) { }

    addOrder(order) {
        this.isAddingOrder = false;

        this.ordersSubscription.unsubscribe();

        this.ordersSubscription = this.orderService.createOrder(order.title, order.description, order.votesPerUser)
            .flatMap(_ => this.orderService.getOrders())
            .do(activeOrders => this.orders = this.filterOrders(activeOrders))
            .flatMap(orders => Observable.combineLatest(orders.map(o => this.orderService.observe(o.OrderId))))
            .subscribe(latestOrders => this.orders = this.filterOrders(latestOrders));
    }

    ngOnInit() {
        this.authService.isLoggedIn().subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
        this.authService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);

        this.ordersSubscription = this.orderService.getOrders()
            .do(activeOrders => this.orders = this.filterOrders(activeOrders))
            .flatMap(orders => Observable.combineLatest(orders.map(o => this.orderService.observe(o.OrderId))))
            .subscribe(latestOrders => this.orders = this.filterOrders(latestOrders));

        this.subscriptions.push(this.ordersSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    private filterOrders = (orders: Order[]) => orders.filter(o => !!o);
}
