import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'onTap',
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class AppComponent implements OnInit {
    isSigningUp: boolean;
    isLoggedIn: boolean;
    emailInput: string;
    passwordInput: string;

    constructor(private _authService: AuthService) {
    }

    ngOnInit() {
        this._authService.isLoggedIn().subscribe(_ => {
            this.isLoggedIn = _;
        });

        this._authService.checkIfLoggedIn();
    }

    toggleSignUp() {
        if (!this.isSigningUp) {
            this.isSigningUp = true;
        }
    }

    signUp() {
        this._authService.signUp(this.emailInput, this.passwordInput)
            .subscribe();
    }

    logIn() {
        this._authService.logIn(this.emailInput, this.passwordInput)
            .subscribe();
    }

    logOut() {
        this._authService.logOut()
            .subscribe();
    }
}
