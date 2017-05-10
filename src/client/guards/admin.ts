import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {AuthService} from '../services/auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private _auth: AuthService,
        private _router: Router
    ) {}


    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._auth.checkIfAdmin()
        .do(
            isAdmin => {
                if (!isAdmin) {
                    this._router.navigate(['/']);
                }
            }
        );
    }
}
