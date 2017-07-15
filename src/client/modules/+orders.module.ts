import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import { OrdersComponent, AddOrderComponent, OrderComponent } from '../components/orders';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: '', component: OrdersComponent},
            ]
        )
    ],
    declarations: [
        OrdersComponent,
        AddOrderComponent,
        OrderComponent
    ],
    exports: [
        OrdersComponent,
        AddOrderComponent,
        OrderComponent
    ]
})
export class LazyOrdersModule { }
