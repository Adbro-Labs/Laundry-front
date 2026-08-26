import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material/material.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PurchaseInvoiceListComponent } from './purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseInvoiceFormComponent } from './purchase-invoice-form.component';
import { PurchaseInvoiceItemDialogComponent } from './purchase-invoice-item-dialog/purchase-invoice-item-dialog.component';
import { PurchaseInvoiceViewDialogComponent } from './purchase-invoice-view-dialog.component';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { PurchaseInvoiceSettleDialogComponent } from './purchase-invoice-settle-dialog.component';

const routes: Routes = [
  { path: '', component: PurchaseInvoiceListComponent },
  { path: 'create', component: PurchaseInvoiceFormComponent },
  { path: 'view/:id', component: PurchaseInvoiceFormComponent },
];

@NgModule({
  declarations: [
    PurchaseInvoiceListComponent,
    PurchaseInvoiceFormComponent,
    PurchaseInvoiceItemDialogComponent,
    PurchaseInvoiceViewDialogComponent,
    PurchaseInvoiceSettleDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
})
export class PurchaseInvoiceModule {}
