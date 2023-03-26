import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  constructor(private http: HttpClient) { }

  saveMeasure(body) {
    const url = environment.apiUrl + 'measure';
    return this.http.post(url, body);
  }
  getMeasureById(measureId) {
    const url = environment.apiUrl + 'measure/getById/' + measureId;
    return this.http.get(url);
  }
  deleteMeasureById(measureId) {
    const url = environment.apiUrl + 'measure/ById/' + measureId;
    return this.http.delete(url);
  }
  getMeasureListByCustomer(customerId) {
    const url = environment.apiUrl + 'measure/ByCustomer/' + customerId;
    return this.http.get(url);
  }
}
