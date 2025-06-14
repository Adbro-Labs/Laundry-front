import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebpushService {

  constructor(private http: HttpClient) { }

  subscribeforPush(body: any) {
    const url = environment.apiUrl + "push/subscribe";
    return this.http.post(url, body);
  }
  
}
