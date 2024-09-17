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
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemsComponent } from './items/items.component';
import { AddItemComponent } from './add-item/add-item.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServiceCountComponent } from './service-count/service-count.component';
import { NumberpadComponent } from './numberpad/numberpad.component';
import { ItemListComponent } from './item-list/item-list.component';
import { BranchComponent } from './branch/branch.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import { SettlementComponent } from './settlement/settlement.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { CategoryComponent } from './category/category.component';
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
        AddCustomerComponent,
        ItemsComponent,
        AddItemComponent,
        ServiceCountComponent,
        NumberpadComponent,
        ItemListComponent,
        BranchComponent,
        AddBranchComponent,
        BillViewComponent,
        SettlementComponent,
        AddcategoryComponent,
        CategoryComponent
    ],
    providers: [DatePipe]

})
export class LayoutModule { }
