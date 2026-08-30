import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AppConfigService } from '../shared/services/app-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName = '';
  password = '';
  message = '';
  appName: string;
  constructor(
    private router: Router,
    private auth: AuthService,
    private appConfig: AppConfigService
  ) {}

  ngOnInit() {
    this.appName = this.appConfig.appName;
  }

  onLogin() {
    this.message = '';
    const body = {
      userName: this.userName,
      password: this.password,
    };
    this.auth.login(body).subscribe(
      (data: any) => {
        localStorage.setItem('isLoggedin', 'true');
        localStorage.setItem('token', data.token);
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.message = error?.error?.message || 'Invalid Credentials';
        console.log(error);
      }
    );
  }
}
