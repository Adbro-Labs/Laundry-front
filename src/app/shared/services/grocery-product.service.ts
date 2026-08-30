import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GroceryProductService {
  constructor(private http: HttpClient) {}

  search(branchCode = '', query = '', category = '', page = 0, storeCode = '') {
    let params = new HttpParams().set('page', String(page)).set('limit', '30');
    if (branchCode) params = params.set('branchCode', branchCode);
    if (storeCode) params = params.set('storeCode', storeCode);
    if (query) params = params.set('query', query);
    if (category) params = params.set('category', category);
    return this.http.get<any>(environment.apiUrl + 'grocery-products', {
      params,
    });
  }

  getCategories(branchCode = '', storeCode = '') {
    let params = new HttpParams();
    if (branchCode) params = params.set('branchCode', branchCode);
    if (storeCode) params = params.set('storeCode', storeCode);
    return this.http.get<string[]>(
      environment.apiUrl + 'grocery-products/categories',
      { params }
    );
  }

  saveProduct(product: any) {
    if (product._id)
      return this.http.put<any>(
        environment.apiUrl + 'grocery-products/' + product._id,
        product
      );
    return this.http.post<any>(
      environment.apiUrl + 'grocery-products',
      product
    );
  }

  completeSale(body: any) {
    return this.http.post<any>(environment.apiUrl + 'grocery-sales', body);
  }

  getReceiptTemplate() {
    return this.http.get('/assets/html/grocery-receipt.html', {
      responseType: 'text',
    });
  }
}
