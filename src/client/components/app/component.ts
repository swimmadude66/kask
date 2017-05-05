import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'onTap',
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class AppComponent implements OnInit {
    private isSigningUp: boolean;
    private isLoggedIn: boolean;
    private emailInput: string;
    private passwordInput: string;
    
    constructor(private _authService: AuthService) {
    }

    ngOnInit() {
        this._authService.isLoggedIn().subscribe(_ => {
            this.isLoggedIn = _;
            console.log(this.isLoggedIn);
        });

        this._authService.checkLoggedIn();
    }
    
    toggleSignUp() {
        if(!this.isSigningUp)
            this.isSigningUp = true;
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
