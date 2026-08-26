import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StockAllocationService {
  constructor(private http: HttpClient) {}

  create(body: any) {
    const url = environment.apiUrl + 'stock-allocation';
    return this.http.post(url, body);
  }

  getList() {
    const url = environment.apiUrl + 'stock-allocation';
    return this.http.get(url);
  }

  getById(id: string) {
    const url = environment.apiUrl + `stock-allocation/${id}`;
    return this.http.get(url);
  }
}
