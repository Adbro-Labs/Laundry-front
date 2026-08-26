import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PurchaseInvoiceService {
  constructor(private http: HttpClient) {}

  getList(search = '', index = 1) {
    const params = new URLSearchParams({
      search,
      index: String(index),
    });
    const url = environment.apiUrl + `purchase-invoice?${params.toString()}`;
    return this.http.get(url);
  }

  getById(id: string) {
    const url = environment.apiUrl + `purchase-invoice/${id}`;
    return this.http.get(url);
  }

  create(body: any) {
    const url = environment.apiUrl + 'purchase-invoice';
    return this.http.post(url, body);
  }

  update(id: string, body: any) {
    const url = environment.apiUrl + `purchase-invoice/${id}`;
    return this.http.put(url, body);
  }

  cancel(id: string) {
    const url = environment.apiUrl + `purchase-invoice/${id}/cancel`;
    return this.http.post(url, {});
  }
}
