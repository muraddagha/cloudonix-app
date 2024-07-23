import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public get(endpoint: string): Observable<any> {
    return this.http.get(environment.apiUrl + endpoint);
  }
  public remove(endpoint: string, id: any): Observable<any> {
    return this.http.delete(environment.apiUrl + endpoint + id);
  }
  public create(endpoint: string, data: any) {
    return this.http.post(environment.apiUrl + endpoint, data);
  }
  public edit(endpoint: string, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl + endpoint, data);
  }
}
