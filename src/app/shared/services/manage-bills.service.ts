import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageBillsService {

  constructor(private http: HttpClient) { }

    getOrderDetailsByDate(orderDate, branchCode) {
      const url =
        environment.apiUrl +
        `bills/getBillByDateandBranch?orderDate=${orderDate}&branchCode=${branchCode}`;
      return this.http.get(url);
    }
}
