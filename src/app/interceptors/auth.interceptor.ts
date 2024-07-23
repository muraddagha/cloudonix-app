import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, of } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let header = {
            key: "",
            value: ""
        };

        let modifiedReq = req.clone();

        if (this.authService.CurrentUserValue != null) {
            header.key = "Authorization";
            header.value = `Bearer ${this.authService.CurrentUserValue}`;

            modifiedReq = req.clone({
                headers: req.headers.set(header.key, header.value)
            });
        }

        return next.handle(modifiedReq).pipe(
            catchError((err, caught: Observable<HttpEvent<any>>) => {
                if (err instanceof HttpErrorResponse && err.status == 401) {
                    this.authService.logout();
                    this.router.navigate(["/auth"]);
                    return of(err as any);
                }
                throw err;
            })
        );
    }
}