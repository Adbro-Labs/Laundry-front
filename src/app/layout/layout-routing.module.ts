import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch/branch.component';
import { CustomerComponent } from './customer/customer.component';
import { ItemsComponent } from './items/items.component';
import { LayoutComponent } from './layout.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { TakeOrderComponent } from './take-order/take-order.component';
import { CategoryComponent } from './category/category.component';
import { DeliveryScheduleComponent } from './delivery-schedule/delivery-schedule.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'orders',
                component: OrderDetailsComponent
            },
            {
                path: 'takeOrder/:id',
                component: TakeOrderComponent
            },
            {
                path: 'customers',
                component: CustomerComponent
            },
            {
                path: 'takeOrder',
                component: TakeOrderComponent
            },
            {
                path: 'items',
                component: ItemsComponent
            },
            {
                path: 'reports',
                loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
            },
            {
                path: 'branch',
                component: BranchComponent
            },
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'delivery-schedule',
                component: DeliveryScheduleComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
