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
  getAllBranch() {
    const url = environment.apiUrl + 'branch';
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
}
