import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GroceryProductService } from 'src/app/shared/services/grocery-product.service';

interface BasketLine {
  productId: string;
  itemName: string;
  sku: string;
  unit: 'PIECE' | 'KG';
  sellingPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-grocery-checkout',
  templateUrl: './grocery-checkout.component.html',
  styleUrls: ['./grocery-checkout.component.scss'],
})
export class GroceryCheckoutComponent implements OnInit {
  @ViewChild('productSearch') productSearch: ElementRef<HTMLInputElement>;

  searchControl = new FormControl('');
  products: any[] = [];
  categories: string[] = [];
  selectedCategory = '';
  basket: BasketLine[] = [];
  discount = 0;
  isSaving = false;
  branchCode = '';
  vatEnabled = false;

  constructor(
    private auth: AuthService,
    private groceryProducts: GroceryProductService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const user = this.auth.decodeJwt();
    this.branchCode = user?.branchCode || '';
    this.vatEnabled = Boolean(user?.vatEnabled);
    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(() => this.searchProducts());
    if (!this.branchCode) {
      this.snack.open('Select a grocery branch before starting a sale', 'OK', {
        duration: 3000,
      });
      return;
    }
    this.groceryProducts
      .getCategories(this.branchCode)
      .subscribe(categories => (this.categories = categories || []));
    this.searchProducts();
  }

  searchProducts(): void {
    if (!this.branchCode) return;
    this.groceryProducts
      .search(
        this.branchCode,
        this.searchControl.value || '',
        this.selectedCategory
      )
      .subscribe({
        next: response => (this.products = response.data || []),
        error: () => (this.products = []),
      });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.searchProducts();
  }

  addFromSearch(): void {
    const query = (this.searchControl.value || '').trim().toUpperCase();
    const exactMatch = this.products.find(
      product => product.sku === query || product.barcode === query
    );
    if (exactMatch) this.addProduct(exactMatch);
  }

  addProduct(product: any): void {
    const existingLine = this.basket.find(
      line => line.productId === product._id
    );
    if (existingLine) {
      existingLine.quantity += 1;
    } else {
      this.basket.push({
        productId: product._id,
        itemName: product.itemName,
        sku: product.sku,
        unit: product.unit,
        sellingPrice: Number(product.sellingPrice),
        quantity: 1,
      });
    }
    this.searchControl.setValue('', { emitEvent: false });
    this.focusSearch();
  }

  updateQuantity(line: BasketLine, quantity: number): void {
    line.quantity = Number(quantity) || 0;
    if (line.quantity <= 0) this.removeLine(line);
  }

  removeLine(line: BasketLine): void {
    this.basket = this.basket.filter(item => item !== line);
    this.focusSearch();
  }

  get subtotal(): number {
    return this.basket.reduce(
      (total, line) => total + line.sellingPrice * line.quantity,
      0
    );
  }

  get vat(): number {
    return this.vatEnabled
      ? Math.max(this.subtotal - this.discount, 0) * 0.05
      : 0;
  }

  get total(): number {
    return Math.max(this.subtotal - this.discount, 0) + this.vat;
  }

  checkout(paymentMethod: string): void {
    if (!this.basket.length || this.isSaving) return;
    this.isSaving = true;
    this.groceryProducts
      .completeSale({
        paymentMethod,
        discount: this.discount,
        lines: this.basket,
      })
      .subscribe({
        next: response => {
          this.isSaving = false;
          this.basket = [];
          this.discount = 0;
          this.printReceipt(response);
          const lowStock = response.lowStock || [];
          this.snack.open(
            lowStock.length
              ? `Sale saved. Low stock: ${lowStock.map(item => item.itemName).join(', ')}`
              : `Sale ${response.masterResponse.orderNumber} completed`,
            'OK',
            { duration: 4500 }
          );
          this.searchProducts();
          this.focusSearch();
        },
        error: error => {
          this.isSaving = false;
          this.snack.open(
            error?.error?.message || 'Unable to complete sale',
            'OK',
            { duration: 3000 }
          );
        },
      });
  }

  private focusSearch(): void {
    setTimeout(() => this.productSearch?.nativeElement.focus());
  }

  private printReceipt(response: any): void {
    this.groceryProducts.getReceiptTemplate().subscribe(template => {
      const master = response.masterResponse;
      const branch = this.auth.decodeJwt();
      const rows = response.lines
        .map(
          line =>
            `<tr><td>${line.itemName}<div class="sku">${line.sku}</div></td><td>${line.quantity}</td><td>${line.lineTotal.toFixed(2)}</td></tr>`
        )
        .join('');
      const vatLabel = master.vatEnabled
        ? `<span>VAT (5%)</span><span>AED ${Number(master.vatAmount).toFixed(2)}</span>`
        : '<span>VAT</span><span>AED 0.00</span>';
      const receipt = template
        .replace('[TITLE]', branch?.branchName || 'Grocery Receipt')
        .replace('[SHOPNAME]', branch?.branchName || 'Grocery Store')
        .replace('[ADDRESS]', '')
        .replace('[TRN]', branch?.taxNumber ? `TRN: ${branch.taxNumber}` : '')
        .replace('[ORDER_NO]', master.orderNumber)
        .replace(
          '[DATE]',
          this.datePipe.transform(
            master.orderDate,
            'dd-MM-yyyy hh:mm a',
            '+0400'
          ) || ''
        )
        .replace('[ITEMS]', rows)
        .replace('[SUBTOTAL]', Number(master.subTotal).toFixed(2))
        .replace('[DISCOUNT]', Number(master.discount).toFixed(2))
        .replace('[VAT_LABEL]', vatLabel)
        .replace('[TOTAL]', Number(master.netTotal).toFixed(2))
        .replace('[PAYMENT]', master.paymentMethod);
      const printWindow = window.open('', '', 'width=400,height=650');
      if (!printWindow) return;
      printWindow.document.write(receipt);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    });
  }
}
