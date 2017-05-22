import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'onTap',
  templateUrl: './template.html',
  styleUrls: ['../styles.scss', './styles.scss']
})
export class AppComponent implements OnInit {
    isSigningUp: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
    emailInput: string;
    passwordInput: string;
    hideLoginForm: boolean;


    constructor(private _authService: AuthService,  private _activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        if (location.href.split('display').length > 1) {
            this.hideLoginForm = true;
        }

        this._authService.isLoggedIn().subscribe(_ => {
            this.isLoggedIn = _;
        });

        this._authService.isAdmin().subscribe(_ => {
            this.isAdmin = _;
        });

        this._authService.checkIfLoggedIn().subscribe();
    }

    toggleSignUp() {
        this.isSigningUp = !this.isSigningUp;
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
