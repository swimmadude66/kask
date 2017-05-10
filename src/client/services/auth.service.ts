import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, Subject, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class AuthService {

    private loggedInSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
    private adminSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: Http
    ) {}

    isLoggedIn(): Observable<boolean> {
        return this.loggedInSubject;
    }

    isAdmin(): Observable<boolean> {
        return this.adminSubject;
    }

    checkIfLoggedIn(): Observable<boolean> {
        return this.http.get('/api/auth')
            .map(res => res.json())
            .do(_ => {
                this.loggedInSubject.next(_.isAuth);
                this.adminSubject.next(_.isAdmin);
            })
            .map(res => res.isAuth);
    }

    checkIfAdmin(): Observable<boolean> {
        return this.http.get('/api/auth')
            .map(res => res.json())
            .do(_ => {
                this.loggedInSubject.next(_.isAuth);
                this.adminSubject.next(_.isAdmin);
            })
            .map(res => res.isAdmin);
    }

    signUp(Email: string, Password: string) {
        return this.http.post('/api/auth/signup', {
            Email, Password
        })
        .do(() => this.checkIfLoggedIn().subscribe());
    }

    logIn(Email: string, Password: string) {
        return this.http.post('/api/auth/login', {
            Email, Password
        })
        .do(() => this.checkIfLoggedIn().subscribe());
    }

    logOut() {
        return this.http.post('/api/auth/logout', {})
            .do(() => this.checkIfLoggedIn().subscribe());
    }
}
