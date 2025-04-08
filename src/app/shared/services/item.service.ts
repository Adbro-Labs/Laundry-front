import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  getItems(customerId = null) {
    let url = environment.apiUrl + 'item';
    if (customerId) {
      url = url + `?customerId=${customerId}`;
    }
    return this.http.get(url);
  }
  saveItem(body, customerId = null) {
    let url = environment.apiUrl + 'item';
    if (customerId) {
      url = url + `?customerId=${customerId}`;
    }
    return this.http.post(url, body);
  }
  getAllItems(customerId = null) {
    let url = environment.apiUrl + 'item';
    if (customerId) {
      url = url + `?customerId=${customerId}`;
    }
    return this.http.get(url);
  }
}
