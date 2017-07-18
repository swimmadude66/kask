import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subscribable } from 'rxjs/Observable';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { OrderStatus } from '../../server/models/order.model';
import { KegSize } from '../models';
import { Order } from '../models/order.model';
import { SocketService } from './index';

@Injectable()
export class OrderService {
    private orders: {[key: number]: Subject<Order>} = {};

    constructor(
        private http: Http,
        private sockets: SocketService
    ) {
        sockets.onRoot('OrderEvent', (order) => {
            if (order.Order && order.Order.Status === OrderStatus.Cancelled) {
                order.Order = null;
            }
            this.getSubject(this.orders, order.OrderId).next(order.Order);
        });
    }

    observe(orderId: number): Observable<Order> {
        return this.getSubject(this.orders, orderId);
    }

    getOrders(fromDate: string, toDate: string): Observable<Order[]> {
        return this.http.get(`/api/orders?fromDate=${fromDate}&toDate=${toDate}`)
        .map(res => res.json())
        .map(result => result.Orders);
    }

    getOrder(orderId: number): Observable<Order> {
        return this.http.get(`/api/orders/${orderId}`)
        .map(res => res.json())
        .map(result => result.Order);
    }

    vote(orderId: number, orderBeerId: number, vote: any): Observable<any> {
        return this.http.post(`/api/votes/order/${orderId}/beer`, {
            OrderBeerId: orderBeerId,
            Vote: vote
        }).map(res => res.json());
    }

    // admin routes
    createOrder(title: string, description: string, votesPerUser: number): Observable<any> {
        return this.http.post(`/api/admin/orders`, {
            Title: title,
            Description: description,
            VotesPerUser: votesPerUser
        }).map(res => res.json());
    }

    updateOrder(orderId: number, partialOrder: any) {
        return this.http.patch(`/api/admin/orders/${orderId}`, partialOrder);
    }

    addBeerToOrder(orderId: number, beerId: number, size: KegSize) {
        return this.http.put(`/api/admin/orders/${orderId}/beer`, {
            BeerId: beerId,
            Size: size
        }).map(res => res.json());
    }

    removeBeerFromOrder(orderId: number, orderBeerId: number) {
        return this.http.delete(`/api/admin/orders/${orderId}/beer/${orderBeerId}`);
    }

    private getSubject<T>(collection: {[key: number]: Subject<T>}, id: any): Subject<T> {
        if (!collection[id]) {
            collection[id] = new ReplaySubject<T>(1);
        }
        return collection[id];
    }
}
