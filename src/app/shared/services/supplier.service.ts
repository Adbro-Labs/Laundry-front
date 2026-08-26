import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  constructor(private http: HttpClient) {}

  getList() {
    const url = environment.apiUrl + 'supplier';
    return this.http.get(url);
  }

  getById(id: string) {
    const url = environment.apiUrl + `supplier/${id}`;
    return this.http.get(url);
  }

  create(body: any) {
    const url = environment.apiUrl + 'supplier';
    return this.http.post(url, body);
  }

  update(id: string, body: any) {
    const url = environment.apiUrl + `supplier/${id}`;
    return this.http.put(url, body);
  }

  disable(id: string) {
    const url = environment.apiUrl + `supplier/${id}/disable`;
    return this.http.post(url, {});
  }
}
