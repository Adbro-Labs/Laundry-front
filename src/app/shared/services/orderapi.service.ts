import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderapiService {
  constructor(private http: HttpClient) {}

  getLatestOrderNumber(branchCode) {
    const url = environment.apiUrl + 'order/getOrderNumber?branchCode=' + branchCode;
    return this.http.get(url);
  }
  saveOrdere(body) {
    const url = environment.apiUrl + 'order';
    return this.http.post(url, body);
  }
  getInvoiceTemplate() {
    const url = '/assets/html/invoice.html';
    return this.http.get(url, { responseType: 'text' });
  }
  getInvoiceTemplateWithoutVat() {
    const url = '/assets/html/invoice-withoutVat.html';
    return this.http.get(url, { responseType: 'text' });
  }

  getInvoiceReportTemplate() {
    const url = '/assets/html/invoice-report.html';
    return this.http.get(url, { responseType: 'text' });
  }
  getOrderDetailsByNumber(orderNumber, branchCode) {
    const url =
      environment.apiUrl +
      `order/ByOrderNumber?orderNumber=${orderNumber}&branchCode=${branchCode}`;
    return this.http.get(url);
  }
  getOrderDetailsByCustomer(customerId, index = 0) {
    const url = environment.apiUrl + `order/ByCustomerId?customerId=${customerId}&index=${index}`;
    return this.http.get(url);
  }
  getAllOrders(index, limit, searchText, branchCode) {
    const url =
      environment.apiUrl +
      `order?limit=${limit}&index=${index}&query=${searchText}&branchCode=${branchCode}`;
    return this.http.get(url);
  }
  cancelOrder(orderDetails) {
    const url = environment.apiUrl + 'order/cancelOrder';
    return this.http.post(url, orderDetails);
  }
  updateOrderStatus(orderId, status, paymentMethod) {
    const url =
      environment.apiUrl +
      'order/updateStatus?orderId=' +
      orderId +
      '&status=' +
      status +
      '&paymentMethod=' +
      paymentMethod;
    return this.http.post(url, {});
  }
}
