import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryItemsListComponent } from './items/items-list.component';
import { InventoryItemFormComponent } from './items/items-form.component';
import { SupplierListComponent } from './suppliers/suppliers-list.component';
import { SupplierFormComponent } from './suppliers/suppliers-form.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    children: [
  { path: 'items', component: InventoryItemsListComponent },
  { path: 'items/create', component: InventoryItemFormComponent },
  { path: 'items/edit/:id', component: InventoryItemFormComponent },
  { path: 'items/view/:id', component: InventoryItemFormComponent },
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/create', component: SupplierFormComponent },
  { path: 'suppliers/edit/:id', component: SupplierFormComponent },
  { path: 'suppliers/view/:id', component: SupplierFormComponent },
  { path: 'purchase-invoices', loadChildren: () => import('./purchase-invoices/purchase-invoice.module').then(m => m.PurchaseInvoiceModule) },
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule) },
  { path: 'allocations', loadChildren: () => import('./allocations/allocations.module').then(m => m.AllocationsModule) },
  { path: 'reports', component: ReportsComponent },
      // purchase invoices, payments, allocations routes will be added similarly when components exist
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class InventoryRoutingModule {}
