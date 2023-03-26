import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderapiService {

  constructor(private http: HttpClient) { }

  getLatestOrderNumber() {
    const url = environment.apiUrl + 'order/getOrderNumber';
    return this.http.get(url);
  }
  saveOrdere(body) {
    const url = environment.apiUrl + 'order';
    return this.http.post(url, body);
  }
  getInvoiceTemplate() {
    const url = "/assets/html/invoice.html";
    return this.http.get(url, {responseType: "text"});
  }
  getOrderDetailsByNumber(orderNumber) {
    const url = environment.apiUrl + 'order/ByOrderNumber/' + orderNumber;
    return this.http.get(url);
  }
  getAllOrders(){
    const url = environment.apiUrl + 'order';
    return this.http.get(url);
  }
}
