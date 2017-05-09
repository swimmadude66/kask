import {Observable} from 'rxjs/Rx';
import {AuthService} from '../services/auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

export class LoggedInGuard implements CanActivate {
    constructor(
        private _auth: AuthService,
        private _router: Router
    ) {}


    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._auth.checkIfLoggedIn()
        .do(
            isLoggedIn => {
                if (!isLoggedIn) {
                    this._router.navigate(['/']);
                }
            }
        );
    }
}
