import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InventoryItemService {
  constructor(private http: HttpClient) {}

  getList() {
    const url = environment.apiUrl + 'inventory-item';
    return this.http.get(url);
  }

  getById(id: string) {
    const url = environment.apiUrl + `inventory-item/${id}`;
    return this.http.get(url);
  }

  create(body: any) {
    const url = environment.apiUrl + 'inventory-item';
    return this.http.post(url, body);
  }

  disable(id: string) {
    const url = environment.apiUrl + `inventory-item/${id}/disable`;
    return this.http.post(url, {});
  }
}
