import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  data: any = {};
  basurl = environment.baseUrl


  constructor(private http: HttpClient) { }


  get userToken() {
    return JSON.parse(window.localStorage.getItem("localuser")).token;
  }

  selectteam() :Observable <any>{
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
    return this.http.get<any>(this.basurl + 'teams', { headers: headers })

  }

  selectmembers(id) {
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
    return this.http.get(this.basurl + 'team/'+id,{ headers: headers });
  }
  deletemembers(member) {
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
    return this.http.post(this.basurl +'team/user/delete', member,{ headers: headers });
  }

  EditMmember(payLoad){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
    return this.http.post(this.basurl+'team/user/edit',payLoad,{ headers: headers })
  }


  createteam(name): Observable <any>{
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
      
    let body = {
      name: name
  }
    return this.http.post(this.basurl+'team/create',body,{ headers: headers })
  }
  

  getinstegramaccount(Id ,instagram_business_account){
    return this.http.get<any>('graph.facebook.com/v3.2/'+Id+'?fields'+'='+instagram_business_account)
  }

  inviteteame(endpoint: string, body: {}){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });

    return this.http.post<any>(`${this.basurl}${endpoint}`,body,{headers: headers})
  }
}
