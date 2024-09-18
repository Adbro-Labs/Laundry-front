import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class CategoryService {
    tempCategoryList: any = [];

    constructor(private http: HttpClient) {}

    saveCategory(body) {
        console.log("categry service", body);
        const url = environment.apiUrl + "category";
        return this.http.post(url, body);
    }
    getAllCategory(index: number, query: string = ""): Observable<any> {
      let url = `${environment.apiUrl}category?index=${index}`;
      if (query) {
        url += `&text=${query}`;
      }
      return this.http.get<any>(url);
    }
    getActiveCategories() {
      let url = `${environment.apiUrl}category?active=true`
      return this.http.get<any>(url);
    }
 
    
}


