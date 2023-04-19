import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { ItemDetailsComponent } from '../item-details/item-details.component';

@Component({
  selector: 'app-take-order',
  templateUrl: './take-order.component.html',
  styleUrls: ['./take-order.component.scss']
})
export class TakeOrderComponent implements OnInit {
  orderNumber;
  customerDetails;
  showNoCustomer;
  orderDate = new Date();
  orderTime;
  disableUpdate = false;
  orderMaster;
  showCancelOrder = false;
  branchDetails;
  orderStatus = "PENDING";
  enablePrint = false;
  @ViewChild(ItemDetailsComponent) items: ItemDetailsComponent;
  mobileNumber = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  constructor(private route: ActivatedRoute, private customer: CustomerService, private auth: AuthService,
    private dialog: MatDialog, private order: OrderService, private orderApi: OrderapiService, private snack: MatSnackBar, private datePipe: DatePipe) { 
  }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.orderNumber = data.id;
      if (this.orderNumber) {
        this.getOrderDetailsByOrderNumber(this.orderNumber);
      }
    });
    
    this.mobileNumber.valueChanges.subscribe(data => {
      if (this.mobileNumber.valid) {
        this.searchCustomer(data);
      }
    });
  }

  searchCustomer(number) {
    this.customer.searchCustomerByMobile(number).subscribe(data => {
      this.showNoCustomer = false;
      this.customerDetails = data;
      this.order.setCustomerId((data as any)._id);
      this.getBranchDetails();
    }, error => {
      this.showNoCustomer = true;
      if (error.status == 404) {
        this.customerDetails = null;
      }
    });
  }
  showCustomerForm() {
    this.dialog.open(AddCustomerComponent, {
      disableClose: true, width: '400px', data: {mobile: this.mobileNumber.value}
    }).afterClosed().subscribe(data => {
      if (data) {
        const mobileNumber = data.mobile;
        if (mobileNumber) {
          this.mobileNumber.setValue(mobileNumber);
        }
      }
    });
  }
  getOrderDetailsByOrderNumber(orderNumber) {
    this.orderApi.getOrderDetailsByNumber(orderNumber).subscribe(data => {
      this.disableUpdate = true;
      const orderMaster = (data as any).orderMaster;
      this.branchDetails = (data as any).branchDetails;
      this.orderMaster = orderMaster;
      if (orderMaster) {
        this.orderDate = new Date(orderMaster.orderDate);
      }
      this.orderNumber = orderMaster?.orderNumber;
      this.customerDetails = orderMaster?.customer;
      this.items.discount = orderMaster?.discount;
      this.items.additionalInstructions = orderMaster?.additionalInstructions;
      this.items.deliveryType = orderMaster?.deliveryType;
      this.items.deliveryTime = orderMaster?.deliveryTime;
      this.items.netTotal = orderMaster?.netTotal;
      this.items.disableUpdate = true;
      this.mobileNumber.setValue(this.customerDetails.mobile);
      this.items.setItemDetail((data as any).orderDetails);
      this.enablePrint = true;
    });
  }
  saveOrder(status = null) {
    if (this.items.orderDetails.valid) {
      const items = this.items.orderDetails.value;
      let total = 0;
      let netTotal = 0;
      if (items) {
        items.forEach(element => {
          total = total + Number(element.total);
        });
        netTotal = total;
        const discount = Number(this.items.discount);
        if (discount) {
          netTotal = total - discount;
        }
      }
      const orderDetails = {
        orderMaster: {
          orderNumber: this.orderNumber,
          customer: this.customerDetails,
          customerId: this.customerDetails?._id,
          total: total,
          discount: Number(this.items.discount),
          netTotal: netTotal,
          additionalInstructions: this.items.additionalInstructions,
          deliveryType: this.items.deliveryType,
          deliveryTime: this.items.deliveryTime,
          branchCode: this.auth.decodeJwt()?.branchCode,
          status: this.orderStatus
        },
        orderDetails: this.items.orderDetails.value
      }
      this.orderApi.saveOrdere(orderDetails).subscribe(data=> {
        const OrderMaster = (data as any)?.masterResponse;
        if (OrderMaster) {
          this.orderMaster = OrderMaster;
        }
        this.printReciept();
        this.enablePrint = true;
        this.snack.open("Order placed successfully", "Ok", {duration: 1500});
      })
    } else {
      this.snack.open("complete the item details", "Ok", {duration: 1500});
    }
  }
  printReciept() {
    const elementIdsToHide = [];
    this.orderApi.getInvoiceTemplate().subscribe(htmlString => {
      htmlString = htmlString.replace('[ORDER_NO]', this.orderNumber);
      htmlString = htmlString.replace('[CUSTOMER_NAME]', this.customerDetails?.customerName);
      //  htmlString = htmlString.replace('[customerAddress]', this.customerDetails?.address);
      htmlString = htmlString.replace('[CUSTOMER_MOBILE]', this.customerDetails?.mobile);
      htmlString = htmlString.replace('[DATE]', this.datePipe.transform(this.orderDate, "dd-MM-yyyy"));
      htmlString = htmlString.replace('[SHOPNAME]', this.branchDetails?.title);
      htmlString = htmlString.replace('[TITLE]', this.branchDetails?.title);
      htmlString = htmlString.replace('[SUBTITLE1]', this.branchDetails?.subtitle1);
      htmlString = htmlString.replace('[SUBTITLE2]', this.branchDetails?.subtitle2);
      // htmlString = htmlString.replace('[TIME]', this.datePipe.transform(this.orderDate, "hh:mm:ss a"));
       const itemDetails = this.items.orderDetails.value;
       let itemsString;
       let subTotal = 0;
       itemDetails.forEach(el => {
         const item = `<tr>
         <td style="text-align: left;">${el.itemName}</td>
         <td>${el.quantity}</td>
         <td>${el.rate}</td>
         <td>${el.total}</td>
         </tr>`;
         itemsString += item;
         subTotal += Number(el.total);
       });
       htmlString = htmlString.replace('[itemDetails]', itemsString);
       if (this.orderMaster?.discount) {
         htmlString = htmlString.replace('[DISCOUNT]', this.orderMaster?.discount);
       } else {
         elementIdsToHide.push('discountLabel');
       }
       htmlString = htmlString.replace('[NETTOTAL]', this.orderMaster?.netTotal);
       if (this.orderMaster?.additionalInstructions) {
          htmlString = htmlString.replace('[NOTES]', this.orderMaster?.additionalInstructions);
       } else {
          elementIdsToHide.push('notelabel');
       }
       htmlString = htmlString.replace('[DELIVREY_TYPE]', this.orderMaster?.deliveryType);
       if (this.orderMaster?.deliveryTime) {
         htmlString = htmlString.replace('[DELIVREY_TIME]', this.orderMaster?.deliveryTime);
       } else {
         elementIdsToHide.push('deliveryTimeLabel');
       }
       htmlString = htmlString.replace('undefined', "");
       var printWindow = window.open('', '', 'height=600,width=900');  
       printWindow.document.write(`<html><head><title>${this.branchDetails?.title}</title>`);  
       printWindow.document.write('</head><body>');  
       printWindow.document.write(htmlString);
       elementIdsToHide.forEach(data => {
         printWindow.document.getElementById(data).style.display = "none";
       })
       printWindow.document.write('</body></html>');
       printWindow.document.close();
       setTimeout(() => {
        printWindow.print();
        printWindow.close();
       }, 750);  
    });
  }
  cancelOrder() {
    const orderId = this.orderMaster._id;
    if (orderId) {
      this.orderApi.cancelOrder(orderId).subscribe(data => {
        this.snack.open("Order cancelled successfuly", "Ok", {duration: 1500});
      }, error => {
        this.snack.open("Something went wrong", "Ok", {duration: 1500});
      });
    }
  }
  getBranchDetails() {
    this.customer.getBranchByCode(this.auth.decodeJwt()?.branchCode).subscribe(data =>{
      this.branchDetails = data as any;
    })
  }
}
