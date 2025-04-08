import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerStatementComponent } from './customer-statement/customer-statement.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
  },
  {
    path: 'daily',
    component: DailyReportComponent,
  },
  {
    path: 'customer',
    component: CustomerStatementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
