import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { PaymentsListComponent } from './payments-list.component';
import { PaymentsFormComponent } from './payments-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../shared/pipes/pipes.module';

const routes: Routes = [
  { path: '', component: PaymentsListComponent },
  { path: 'create', component: PaymentsFormComponent },
];

@NgModule({
  declarations: [PaymentsListComponent, PaymentsFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
})
export class PaymentsModule {}
