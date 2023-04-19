import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

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
  getAllCustomers() {
    const url = environment.apiUrl + 'customer';
    return this.http.get(url);
  }
  getBranchByCode(code) {
    const url = environment.apiUrl + 'branch/getByCode/' + code;
    return this.http.get(url);
  }
}
