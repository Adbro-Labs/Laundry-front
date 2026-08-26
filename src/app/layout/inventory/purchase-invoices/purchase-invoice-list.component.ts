import { Component, OnInit } from '@angular/core';
import { PurchaseInvoiceService } from 'src/app/shared/services/purchase-invoice.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-purchase-invoice-list', template: `<div class="page"><h2>Purchase Invoices</h2><button mat-raised-button color="primary" (click)="create()">Create</button><div *ngFor="let i of invoices">{{i.invoiceNumber}} - {{i.grandTotal}}</div></div>` })
export class PurchaseInvoiceListComponent implements OnInit {
  invoices = [];
  constructor(private svc: PurchaseInvoiceService, private router: Router) {}
  ngOnInit(): void { this.svc.getList().subscribe((res:any)=> this.invoices = res.data || res); }
  create(){ this.router.navigate(['/inventory/purchase-invoices/create']); }
}
