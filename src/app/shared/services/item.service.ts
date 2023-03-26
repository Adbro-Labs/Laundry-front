import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getItems() {
    const url = environment.apiUrl + 'item';
    return this.http.get(url);
  }
  saveItem(body) {
    const url = environment.apiUrl + 'item';
    return this.http.post(url, body);
  }
  getAllItems() {
    const url = environment.apiUrl + 'item';
    return this.http.get(url);
  }
}
