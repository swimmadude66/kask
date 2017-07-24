import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Order, OrderStatus } from '../../../models/order.model';
import { OrderBeer } from '../../../models/orderbeer.model';
import { Vote } from '../../../models/ordervote.model';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/orders.service';
import {Location} from '../../../models/location.model';
import { orderBy } from 'lodash';

@Component({
    selector: 'order',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', './styles.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private sorters = {
        name: [(order: OrderBeer) => order.Beer.BeerName],
        size: [(order: OrderBeer) => [order.Size, order.Beer.BeerName]],
        brewery: [(order: OrderBeer) => [order.Beer.Brewery.BreweryName, order.Beer.BeerName]],
        style: [(order: OrderBeer) => [order.Beer.Style.StyleName, order.Beer.BeerName]],
        votes: [
            // this one has two functions because they need to be sorted independently
            [
                ((order: OrderBeer) => order.NetVote),
                ((order: OrderBeer) => order.Beer.BeerName)
            ],
            ['desc', 'asc']
        ],
        id: [(order: OrderBeer) => order.OrderBeerId],
    };

    @Input() orderInfo: Order;
    @Input() isAdmin: boolean;
    @Input() isLoggedIn: boolean;
    @Input() locations: Location[];

    isAddingKeg: boolean = false;
    isEditing: boolean = false;
    isOrderMoved: boolean = false;
    order: Order;
    selectedStatus: OrderStatus;
    orderStatuses = [{
        name: 'Not Ready',
        value: OrderStatus.Incomplete
    }, {
        name: 'Open for Voting',
        value: OrderStatus.Pending
    }, {
        name: 'Ready to Order',
        value: OrderStatus.Finalized
    }, {
        name: 'Order Placed',
        value: OrderStatus.Placed
    }, {
        name: 'Order Received',
        value: OrderStatus.Received
    }, {
        name: 'Cancelled',
        value: OrderStatus.Cancelled
    }];


    constructor(
        private orderService: OrderService,
        private authService: AuthService,
        private adminService: AdminService
    ) { }

    ngOnInit() {
        this.selectedStatus = this.orderInfo.Status;

        this.subscriptions.push(
            this.orderService.observe(this.orderInfo.OrderId)
                .merge(this.orderService.getOrder(this.orderInfo.OrderId))
                .subscribe(order => this.order = order)
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    vote(orderBeer: OrderBeer) {
        let vote: Vote = Vote.Up;
        let id = orderBeer.OrderBeerId;

        let isUpVote = !this.votedForBeer(id);

        if (!isUpVote) {
            vote = Vote.None;
        }

        this.orderService.vote(this.order.OrderId, id, vote).subscribe(_ => {
            orderBeer.NetVote += isUpVote ? 1 : -1;
            if (!isUpVote) {
                this.order.UserVotes = this.order.UserVotes.filter(v => v.OrderBeerId !== id);
            } else {
                this.order.UserVotes.push({
                    OrderVoteId: -1,
                    UserId: -1,
                    OrderBeerId: id,
                    Vote:  isUpVote ? 1 : -1
                });
            }
        });
    }

    votedForBeer(orderBeerId: number) {
        return this.order.UserVotes.some(p => p.OrderBeerId === orderBeerId && p.Vote === 1);
    }

    canVote() {
        return this.order.UserVotes.length < this.order.VotesPerUser;
    }

    isIncomplete() {
        return this.order.Status === OrderStatus.Incomplete;
    }

    isPending() {
        return this.order.Status === OrderStatus.Pending;
    }

    votesRemaining() {
        return this.order.VotesPerUser - this.order.UserVotes.filter(v => v.Vote === 1).length;
    }

    addKegToOrder(kegToAdd: any) {
        this.isAddingKeg = false;
        this.orderService.addBeerToOrder(this.order.OrderId, kegToAdd.Beer.BeerId, kegToAdd.Size).subscribe(_ => _);
    }

    removeKegFromOrder(orderBeerId: number) {
        this.orderService.removeBeerFromOrder(this.order.OrderId, orderBeerId).subscribe(_ => _);
    }

    submitEdit(orderData: any) {
        this.isEditing = false;
        this.orderService.updateOrder(this.order.OrderId, {
            Title: orderData.title,
            Description: orderData.description,
            VotesPerUser: orderData.votesPerUser
        }).subscribe(_ => _);
    }

    submitOrderStatus() {
        this.orderService.updateOrder(this.order.OrderId, { Status: this.selectedStatus}).subscribe(_ => _);
    }

    formatDate(date: string) {
        return date.replace('T', ' ').replace('.000Z', '');
    }

    moveToLocation(result) {
        if (result.dest.indexOf('loc_') === 0) {
            let dest = +result.dest.replace('loc_', '');
            this.order.OrderBeers.forEach(orderBeer => {
                this.adminService.store(orderBeer.Beer.BeerId, orderBeer.Size.toString(), dest).subscribe(_ => this.isOrderMoved = true);
            });
        }
    }

    sortBeerOrder(by: string): void {
        if (by) {
            let [sorter, orders] = this.sorters[by.toLocaleLowerCase()] || this.sorters.id;
            this.order.OrderBeers = orderBy(
                this.order.OrderBeers,
                sorter,
                orders
            );
        }
    }
}
