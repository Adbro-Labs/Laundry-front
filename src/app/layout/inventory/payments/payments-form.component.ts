import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PurchaseInvoiceService } from 'src/app/shared/services/purchase-invoice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ selector: 'app-payments-form', template: `<div class="page"><h2>Create Payment</h2><form [formGroup]="form" (ngSubmit)="save()"><select formControlName="invoiceId"><option *ngFor="let inv of invoices" [value]="inv._id">{{inv.invoiceNumber}}</option></select><input formControlName="amount" type="number"><button type="submit">Save</button></form></div>` })
export class PaymentsFormComponent implements OnInit {
  form: FormGroup; invoices = [];
  constructor(private fb: FormBuilder, private svc: PaymentService, private invSvc: PurchaseInvoiceService, private router: Router) {}
  ngOnInit(){ this.form = this.fb.group({ invoiceId:['',Validators.required], amount:[0,Validators.min(0.01)], paymentDate:[new Date()], paymentMethod:[''], referenceNumber:[''], remarks:[''] }); this.invSvc.getList().subscribe((res:any)=> this.invoices = res.data || res); }
  save(){ if(this.form.invalid) return; this.svc.create(this.form.value).subscribe(()=> this.router.navigate(['/inventory/payments'])); }
}
