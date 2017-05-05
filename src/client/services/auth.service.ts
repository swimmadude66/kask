import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, Subject, ReplaySubject} from 'rxjs/Rx';
@Injectable()
export class AuthService {
    private loggedInSubject: Subject<boolean> = new ReplaySubject<boolean>(1);

    constructor(
        private http: Http
    ) {}

    isLoggedIn(): Observable<boolean> {
        return this.loggedInSubject;
    }

    checkIfLoggedIn(): Observable<boolean> {
        return this.http.get('/api/auth')
            .map(res => res.json())
            .map(res => res.isAuth)
            .do(_ => this.loggedInSubject.next(_));
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
