import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { ReportsComponent } from './reports.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  },
  {
    path: 'daily',
    component: DailyReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
