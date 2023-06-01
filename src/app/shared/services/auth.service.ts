import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(body) {
    const url = environment.apiUrl + "user/auth";
    return this.http.post(url, body);
  }
  decodeJwt(): any {
    try {
      const token = this.getToken();
      if (token) {
        return jwt_decode(token);
      }
      return null;
    } catch(error) {
      return null;
    }
  }
  getUserRole() {
    const data: any = this.decodeJwt();
    if (data && data.userType) {
      return data.userType;
    }
  }
  getToken() {
    const token = localStorage.getItem("token");
    return token;
  }
  getBranchCode() {
    const data: any = this.decodeJwt();
    if (data && data.branchCode) {
      return data.branchCode;
    }
  }
}
