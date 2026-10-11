import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  create(body: any) {
    const url = environment.apiUrl + 'purchase-payment';
    return this.http.post(url, body);
  }

  settleInvoices(
    invoiceIds: string[],
    amount: number,
    paymentMethod: string,
    referenceNumber: string,
    chequeDate?: string | null
  ) {
    const url = environment.apiUrl + 'purchase-payment/settle';
    return this.http.post(url, {
      invoiceIds,
      amount,
      paymentMethod,
      referenceNumber,
      chequeDate,
    });
  }

  getInvoicePayments(invoiceId: string) {
    const url = environment.apiUrl + `purchase-payment?invoiceId=${invoiceId}`;
    return this.http.get(url);
  }

  getPaymentHistory(search = '') {
    const params = new URLSearchParams({ search });
    const url = environment.apiUrl + `purchase-payment?${params.toString()}`;
    return this.http.get(url);
  }
}
