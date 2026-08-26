import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { AllocationsListComponent } from '../allocation-list/allocations-list.component';
import { AllocationsFormComponent } from './allocations-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllocationViewDialogComponent } from './allocation-view-dialog.component';
import { AllocationMonthViewDialogComponent } from './allocation-month-view-dialog.component';

const routes: Routes = [
  { path: '', component: AllocationsListComponent },
  { path: 'create', component: AllocationsFormComponent },
  { path: 'view/:id', component: AllocationsFormComponent },
];

@NgModule({
  declarations: [
    AllocationsListComponent,
    AllocationsFormComponent,
    AllocationViewDialogComponent,
    AllocationMonthViewDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class AllocationsModule {}
