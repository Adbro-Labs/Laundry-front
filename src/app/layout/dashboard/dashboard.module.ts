import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, StatModule, MaterialModule],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
