import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../shared/modules/material/material.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavComponent } from './nav/nav.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { TakeOrderComponent } from './take-order/take-order.component';
import { TopMeasureComponent } from './top-measure/top-measure.component';
import { BottomMeasureComponent } from './bottom-measure/bottom-measure.component';
import { MeasureComponent } from './measure/measure.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemsComponent } from './items/items.component';
import { AddItemComponent } from './add-item/add-item.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServiceCountComponent } from './service-count/service-count.component';
import { NumberpadComponent } from './numberpad/numberpad.component';
@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule
    ],
    declarations: [
        LayoutComponent,
        NavComponent,
        TopnavComponent,
        SidebarComponent,
        ItemDetailsComponent,
        CustomerComponent,
        CustomerCardComponent,
        OrderListComponent,
        OrderDetailsComponent,
        TakeOrderComponent,
        TopMeasureComponent,
        BottomMeasureComponent,
        MeasureComponent,
        AddCustomerComponent,
        ItemsComponent,
        AddItemComponent,
        ServiceCountComponent,
        NumberpadComponent
    ],
    providers: [DatePipe]

})
export class LayoutModule { }
