import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password = '';
  message = '';
  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  onLogin() {
    this.message = '';
    const body = {
      password: this.password,
    };
    this.auth.login(body).subscribe(
      (data: any) => {
        localStorage.setItem('isLoggedin', 'true');
        localStorage.setItem('token', data.token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.message = 'Invalid Credentials';
        console.log(error);
      }
    );
  }
}
