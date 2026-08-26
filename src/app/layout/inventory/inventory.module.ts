import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { InventoryItemsListComponent } from './items/items-list.component';
import { InventoryItemFormComponent } from './items/items-form.component';
import { InventoryItemDialogComponent } from './items/inventory-item-dialog.component';
import { SupplierListComponent } from './suppliers/suppliers-list.component';
import { SupplierFormComponent } from './suppliers/suppliers-form.component';
import { SupplierDialogComponent } from './suppliers/supplier-dialog.component';
import { ReportsComponent } from './reports/reports.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InventoryItemsListComponent,
    InventoryItemFormComponent,
    InventoryItemDialogComponent,
    SupplierListComponent,
    SupplierFormComponent,
    SupplierDialogComponent,
    ReportsComponent,
  ],
  imports: [CommonModule, InventoryRoutingModule, MaterialModule, ReactiveFormsModule, FormsModule],
})
export class InventoryModule {}
