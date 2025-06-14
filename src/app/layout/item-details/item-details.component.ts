import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ItemService } from 'src/app/shared/services/item.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { NumberpadComponent } from '../numberpad/numberpad.component';
import { ServiceCountComponent } from '../service-count/service-count.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit {
  items = [];
  tempItems = [];
  itemDetails = [];
  orderDetails: FormArray;
  today = new Date();
  netTotal;
  subTotal;
  @Input() customerId: string;
  @Output() disableNumberChange = new EventEmitter();
  disableItemSelection = false;
  discount;
  deliveryType = 'ON PREMISE';
  additionalInstructions = '';
  disableUpdate = false;
  deliveryTime = '';
  categories = [];
  isVatEnabled;
  vatAmount;
  roundoffAmount;
  constructor(
    private item: ItemService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private auth: AuthService,
    private category: CategoryService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.getActiveCategories();
    this.orderDetails = new FormArray([], [Validators.required, Validators.minLength(1)]);
    this.isVatEnabled = this.auth.decodeJwt()?.vatEnabled;
  }
  getItems() {
    this.item.getItems(this.customerId).subscribe((data) => {
      this.items = data as any;
      this.tempItems = data as any;
    });
  }
  getActiveCategories() {
    this.category.getActiveCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  filterItems(categoryId) {
    if (categoryId) {
      this.tempItems = this.items.filter((x) => x?.categories?.includes(categoryId));
    } else {
      this.tempItems = this.items;
    }
  }

  initOrderDetails() {
    const orderDetails = this.fb.group({
      _id: [null],
      orderNumber: [null, Validators.required],
      branchCode: [null],
      itemName: [null, Validators.required],
      itemId: [null, Validators.required],
      quantity: [null, Validators.required],
      total: [null, [Validators.required, Validators.min(1)]],
      vat: [null],
      customerId: [null, Validators.required],
      washRequired: [null, Validators.required],
      dryCleanRequired: [null, Validators.required],
      pressRequired: [null, Validators.required],
      rate: [null, Validators.required],
      processType: [null, Validators.required],
      isExpressRequired: [null, Validators.required],
      services: [null, Validators.required],
      date: [this.today],
      status: [null],
    });
    const orderNumber = this.route.snapshot.params.id;
    orderDetails.get('orderNumber').setValue(orderNumber);
    orderDetails.get('customerId').setValue(this.customerId);
    const branchCode = this.auth.decodeJwt()?.branchCode;
    orderDetails.get('branchCode').setValue(branchCode);
    return orderDetails;
  }
  setItemDetail(items: any[]) {
    this.orderDetails = new FormArray([]);
    items.forEach((x) => {
      const form = this.initOrderDetails();
      form.patchValue(x);
      this.orderDetails.push(form);
    });
    this.calculateNetTotal();
  }
  addItem(item) {
    this.dialog
      .open(ServiceCountComponent, { width: '270px', data: item })
      .afterClosed()
      .subscribe((response: any) => {
        if (response) {
          const form = this.initOrderDetails();
          form.patchValue({
            itemName: response?.itemDetails?.itemName,
            itemId: response?.itemDetails?._id,
            quantity: response?.quantity,
            vat: (response?.updatedCharge * 0.05)?.toFixed(2),
            washRequired: response?.washRequired,
            dryCleanRequired: response?.dryCleanRequired,
            pressRequired: response?.pressRequired,
            processType: response?.processType,
            isExpressRequired: response?.expressOrder,
          });
          let services = '';
          let total = 0;
          let rate = response?.updatedCharge;
          if (response?.washRequired) {
            // rate = response?.itemDetails?.washingCharge;
            services = 'Wash&Press';
            if (response?.expressOrder) {
              services = 'Wash&Press(Express)';
              // rate = response?.itemDetails?.expressWashingCharge;
            }
            form.patchValue({
              rate,
            });
            total += rate;
          }
          if (response?.dryCleanRequired) {
            // rate = response?.itemDetails?.dryCleanCharge;
            services = 'Dry Cleaning';
            if (response?.expressOrder) {
              services = 'Dry Cleaning(Express)';
              // rate = response?.itemDetails?.ExpressDryCleanCharge;
            }
            form.patchValue({
              rate,
            });
            total += rate;
          }
          if (response?.pressRequired) {
            // rate = response?.itemDetails?.pressingCharge;
            services = 'Press';
            if (response?.expressOrder) {
              services = 'Press(Express)';
              // rate = response?.itemDetails?.expressPressingCharge;
            }
            form.patchValue({
              rate,
            });
            total += rate;
          }

          total = this.isVatEnabled
            ? Number(total) * response?.quantity + form.value?.vat * form.value?.quantity
            : Number(total) * response?.quantity;

          services = services + `(${response?.processType?.charAt(0)})`;
          form.patchValue({
            services,
            total: total.toFixed(2),
          });
          if (form.valid) {
            this.orderDetails.push(form);
            this.disableNumberChange.emit(true);
            this.calculateNetTotal();
          } else {
            if (form.get('total').invalid) {
              this.snack.open('total should be greater than 0', 'Ok', { duration: 1500 });
            } else {
              this.snack.open('something wrong with item details', 'Ok', { duration: 1500 });
            }
          }
        }
      });
  }

  calculateNetTotal() {
    const items = this.orderDetails.value;

    this.subTotal = items.map((x) => x.rate * x.quantity).reduce((a, b) => a + b, 0);

    if (this.discount) {
      if (this.discount > this.subTotal) {
        this.discount = 0;
      } else {
        this.subTotal = this.subTotal - Number(this.discount);
      }
    }

    if (this.subTotal) {
      if (this.isVatEnabled) {
        const totalAmount = this.orderDetails.value
          .map((x) => x.rate * x.quantity)
          .reduce((a, b) => a + b, 0);
        this.vatAmount = this.orderDetails.value
          .map((x) => x.vat * x.quantity)
          .reduce((a, b) => a + b, 0);
        this.netTotal = this.subTotal + this.vatAmount;
      } else {
        this.netTotal = this.subTotal;
      }

      const roundedAmount = Math.floor(this.netTotal);
      const decimalPart = this.netTotal - roundedAmount;
      const adjustedTotal = decimalPart >= 0.5 ? roundedAmount + 0.5 : roundedAmount;
      this.roundoffAmount = parseFloat((adjustedTotal - this.netTotal)?.toFixed(2));
      this.netTotal = adjustedTotal;
    }
  }
  addNewItem() {
    if (this.disableItemSelection || !this.customerId || this.disableUpdate) {
      return;
    }
    this.dialog
      .open(AddItemComponent, { disableClose: true, width: '400px' })
      .afterClosed()
      .subscribe((response: any) => {
        this.getItems();
      });
  }
  showKeyPad() {
    this.dialog
      .open(NumberpadComponent, { width: '270px', data: this.discount })
      .afterClosed()
      .subscribe((quantity) => {
        if (Number(quantity) >= 0) {
          this.discount = quantity.toFixed(2);
        }
        this.calculateNetTotal();
      });
  }
  deleteItem(index) {
    this.orderDetails.removeAt(index);
    if (this.orderDetails.length < 1) {
      this.disableNumberChange.emit(false);
    }
    this.calculateNetTotal();
  }
}
