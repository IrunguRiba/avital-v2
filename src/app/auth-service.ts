import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IUserRequest} from './request'
import {Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

private localUrl='http://localhost:4000/api';
constructor (private http: HttpClient){}

request(request: IUserRequest): Observable<IUserRequest>{
  console.log('Sending request . . . ')
  return this.http.post<IUserRequest>(`${this.localUrl}/newRequest`, request)
}
}
