import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private currentUserTknSubject: BehaviorSubject<string | null>;
  public currentUserTkn: Observable<string | null>;
  public currentUserInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isFederationDataUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService, private router: Router) {
    let userTkn: string | null = null;
    if (localStorage.getItem('token') != null) {
      userTkn = localStorage.getItem('token') as string;
      this.isUserLoggedIn$.next(true);
    }
    this.currentUserTknSubject = new BehaviorSubject<any>(userTkn);
    this.currentUserTkn = this.currentUserTknSubject.asObservable();
  }

  public get CurrentUserValue(): any {
    return this.currentUserTknSubject.value;
  }

  public login(jwtToken: string): void {
    console.log()
    this.logout();
    localStorage.setItem('token', jwtToken);
    this.currentUserTknSubject.next(jwtToken);
    this.isUserLoggedIn$.next(true);
    this.router.navigate([""]);

  }
  public logout(): void {
    localStorage.removeItem('token');
    this.currentUserTknSubject.next(null);
    this.isUserLoggedIn$.next(false);
    this.router.navigate(["auth"]);

  }
}
