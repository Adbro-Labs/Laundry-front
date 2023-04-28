import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { OrderapiService } from './orderapi.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private customerId = new BehaviorSubject(null);
  private itemDetails = new BehaviorSubject(null);
  public customerIdAgent = this.customerId.asObservable();
  public itemDetailsAgent = this.itemDetails.asObservable();
  orderForm: FormGroup;
  constructor(private fb: FormBuilder, private orderapi: OrderapiService, private auth: AuthService,
    private router: Router) { 
    this.initForm();
  }

 
  setCustomerId(id) {
    this.customerId.next(id);
  }
  addItem(itemId) {
    this.itemDetails.next(itemId);
  }
  setOrderNumber(orderNumber) {
    this.orderForm.patchValue({
      orderMaster: {
        orderNumber
      }
    });
  }
  setCustomerDetails(customerDetails) {
    this.orderForm.patchValue({
      orderMaster: {
        customerId: customerDetails._id,
        customer: customerDetails
      }
    });
  }
  setTotalAmount(total) {
    this.orderForm.patchValue({
      orderMaster: {
        total
      }
    });
  }
  initForm() {
    this.orderForm = this.fb.group({
      orderMaster: this.fb.group({
        orderNumber: [null, Validators.required],
        customer: [null, Validators.required],
        customerId: [null, Validators.required],
        total: [null, Validators.required]
      }),
      orderDetails: this.fb.array([])
    })
  }
  generateNewOrder() {
    const branchCode = this.auth.decodeJwt()?.branchCode;
    if (branchCode) {
      this.orderapi.getLatestOrderNumber(branchCode).subscribe(data => {
        this.router.navigate(['/takeOrder', (data as any).orderNumber]);
      });
    }
  }
}
