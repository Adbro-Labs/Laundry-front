import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    password = "";
    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() { }

    onLogin() {
        console.log(this.password);
        const body = {
            password: this.password
        }
        this.auth.login(body).subscribe((data: any) => {
            localStorage.setItem('isLoggedin', 'true');
            localStorage.setItem('token', data.token);
            this.router.navigate(['/dashboard']);
        }, error => {
            console.log(error);
        });
    }
}
