import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  searchCustomer(number) {
    const url = environment.apiUrl + 'customer/searchCustomer/' + number;
    return this.http.get(url);
  }
  searchCustomerByMobile(number) {
    const url = environment.apiUrl + 'customer/getByMobileNo/' + number;
    return this.http.get(url);
  }
  saveCustomer(body) {
    const url = environment.apiUrl + 'customer';
    return this.http.post(url, body);
  }
  getAllCustomers(index, query = '') {
    let url = environment.apiUrl + 'customer?index=' + index;
    if (query) {
      url = url + '&text=' + query;
    }
    return this.http.get(url);
  }
  getBranchByCode(code) {
    const url = environment.apiUrl + 'branch/getByCode/' + code;
    return this.http.get(url);
  }
  findCustomer(query) {
    const url = environment.apiUrl + 'customer/findCustomer?query=' + query;
    return this.http.get(url);
  }
}
