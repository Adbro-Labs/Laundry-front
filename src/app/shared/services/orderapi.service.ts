import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderapiService {

  constructor(private http: HttpClient) { }

  getLatestOrderNumber(branchCode) {
    const url = environment.apiUrl + 'order/getOrderNumber?branchCode=' + branchCode;
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
  getOrderDetailsByNumber(orderNumber, branchCode) {
    const url = environment.apiUrl + `order/ByOrderNumber?orderNumber=${orderNumber}&branchCode=${branchCode}`;
    return this.http.get(url);
  }
  getOrderDetailsByCustomer(customerId) {
    const url = environment.apiUrl + `order/ByCustomerId?customerId=${customerId}`;
    return this.http.get(url);
  }
  getAllOrders(index, limit, searchText, branchCode){
    const url = environment.apiUrl + `order?limit=${limit}&index=${index}&query=${searchText}&branchCode=${branchCode}`;
    return this.http.get(url);
  }
  cancelOrder(orderId) {
    const url = environment.apiUrl + 'order/cancelOrder?orderId=' + orderId;
    return this.http.post(url, {});
  }
}
