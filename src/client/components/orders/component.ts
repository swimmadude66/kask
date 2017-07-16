import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { OrderService } from '../../services/orders.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import {Location} from '../../models/location.model';
import * as Moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateHelper } from "../../helpers/ngb_date";

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


    fromDate: NgbDateStruct;
    toDate: NgbDateStruct;
    isAdmin: boolean = false;
    isLoggedIn: boolean = false;
    isAddingOrder: boolean = false;

    constructor(
        private orderService: OrderService,
        private authService: AuthService,
        private locationService: LocationService
    ) {
        this.toDate = Object.assign({}, NgbDateHelper.currentDate());
        this.fromDate = NgbDateHelper.momentToDate(Moment().subtract(2, 'w'));
    }

    ngOnInit() {
        this.authService.isLoggedIn().subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
        this.authService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);

        this.locationService.getLocations().subscribe(locations => this.locations = locations);

        this.orderService.getOrders(NgbDateHelper.dateToString(this.fromDate), NgbDateHelper.dateToString(this.toDate))
            .subscribe(orders => this.orders = orders);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    addOrder(order) {
        this.isAddingOrder = false;

        this.ordersSubscription = this.orderService.createOrder(order.title, order.description, order.votesPerUser)
            .flatMap(_ => this.orderService.getOrders(NgbDateHelper.dateToString(this.fromDate), NgbDateHelper.dateToString(this.toDate)))
            .subscribe(orders => this.orders = orders);
    }

    trySubmitDateRange(range) {
        this.fromDate = range.fromDate;
        this.toDate = range.toDate;

        if (!(this.fromDate && this.toDate)) {
            return;
        }

        this.orderService.getOrders(
                NgbDateHelper.dateToString(this.fromDate),
                NgbDateHelper.dateToString(this.toDate, true)
            ).subscribe(orders => this.orders = orders);
    }
}
