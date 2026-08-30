import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private http: HttpClient) {}

  saveBranch(body) {
    const url = environment.apiUrl + 'branch';
    return this.http.post(url, body);
  }
  getAllBranch(storeCode?: string) {
    let url = environment.apiUrl + 'branch';
    if (storeCode) {
      url += `?storeCode=${storeCode}`;
    }
    return this.http.get(url);
  }
  getBranchById(measureId) {
    const url = environment.apiUrl + 'branch/getById/' + measureId;
    return this.http.get(url);
  }
  deleteBranchById(measureId) {
    const url = environment.apiUrl + 'branch/ById/' + measureId;
    return this.http.delete(url);
  }
  approveBranch(branchId) {
    const url = environment.apiUrl + 'branch/approve/' + branchId;
    return this.http.patch(url, {});
  }
  updateBillNumberStart(branchCode: string, billNumberStart: number) {
    const url =
      environment.apiUrl +
      'branch/bill-number-start/' +
      encodeURIComponent(branchCode);
    return this.http.patch(url, { billNumberStart });
  }
}
