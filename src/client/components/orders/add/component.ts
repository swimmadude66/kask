import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';

@Component({
    selector: 'add-order',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', './styles.scss']
})
export class AddOrderComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    @Output() cancelled = new EventEmitter();
    @Output() submitted = new EventEmitter();

    @Input() title: string;
    @Input() description: string;
    @Input() votesPerUser: number = 3;

    constructor(
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    submit() {
        this.submitted.emit({title: this.title, description: this.description, votesPerUser: this.votesPerUser});
    }

    cancel() {
        this.cancelled.emit(true);
    }
}
