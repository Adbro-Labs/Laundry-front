import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/shared/services/order.service';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Amount Recieved', weight: 36000},
    { position: 2, name: 'Pending Amount', weight: 15000 },
    { position: 3, name: 'Total Amount', weight: 41000 },
];

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    displayedColumns = ['position', 'name', 'weight'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    places: Array<any> = [];

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    constructor(public order: OrderService) {
       
    }

    ngOnInit() {}
}
