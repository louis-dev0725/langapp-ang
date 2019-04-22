import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/common.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private user: User;

  get isAdmin(): boolean {
    return (this.user) ? this.user.isAdmin : false;
  }

  get isLoggedIn(): boolean {
    return (this.user) ? this.user.isLoggedIn : false;
  }

  constructor(private http: HttpClient) { }
}
