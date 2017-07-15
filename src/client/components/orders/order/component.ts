import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Order, OrderStatus } from '../../../models/order.model';
import { Vote } from '../../../models/ordervote.model';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/orders.service';

@Component({
    selector: 'order',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', './styles.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    @Input() order: Order;
    @Input() isAdmin: boolean;
    @Input() isLoggedIn: boolean;

    isAddingKeg: boolean = false;
    isEditing: boolean = false;

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
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.selectedStatus = this.order.Status;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    vote(orderBeerId: number) {
        let vote: Vote = Vote.Up;
        let isUpVote = !this.votedForBeer(orderBeerId);

        if (!isUpVote) {
            vote = Vote.None;
        }

        this.orderService.vote(this.order.OrderId, orderBeerId, vote).subscribe(_ => {
            if (!isUpVote) {
                this.order.OrderVotes = this.order.OrderVotes.filter(v => v.OrderBeerId !== orderBeerId);
            } else {
                this.order.OrderVotes.push({
                    OrderVoteId: -1,
                    UserId: -1,
                    OrderBeerId: orderBeerId,
                    Vote: vote
                });
            }
        });
    }

    votedForBeer(orderBeerId: number) {
        return this.order.OrderVotes.some(p => p.OrderBeerId === orderBeerId && p.Vote === Vote.Up);
    }

    canVote() {
        return this.order.OrderVotes.length < this.order.VotesPerUser;
    }

    isIncomplete() {
        return this.order.Status === OrderStatus.Incomplete;
    }

    isPending() {
        return this.order.Status === OrderStatus.Pending;
    }

    votesRemaining() {
        return this.order.VotesPerUser - this.order.OrderVotes.filter(v => v.Vote === Vote.Up).length;
    }

    addKegToOrder(kegToAdd: any) {
        this.isAddingKeg = false;
        //TODO: observable push here so the new order is added to view
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
}
