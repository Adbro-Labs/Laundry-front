import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  saveStore(body) {
    const url = environment.apiUrl + 'store';
    return this.http.post(url, body);
  }

  getAllStore() {
    const url = environment.apiUrl + 'store';
    return this.http.get(url);
  }

  getStoreById(storeId) {
    const url = environment.apiUrl + 'store/getById/' + storeId;
    return this.http.get(url);
  }

  toggleStoreActive(storeId, active: boolean) {
    const url = environment.apiUrl + 'store/toggle/' + storeId;
    return this.http.patch(url, { active });
  }

  linkExistingBranchesToStore(storeId, force = false) {
    const url = environment.apiUrl + 'store/link-branches/' + storeId;
    return this.http.patch(url, { force });
  }
}
