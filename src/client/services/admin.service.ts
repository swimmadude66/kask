import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class AdminService {

    private loggedInSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);

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

    search(beerName: string) {
        return this.http.get(`/api/admin/search/${beerName}`)
            .map(res => res.json());
    }
}
