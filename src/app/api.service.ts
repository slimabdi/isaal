import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from '../environments/environment';

import * as socketIo from 'socket.io-client';

const server_url = 'https://preprod.kpeiz.digital:3000';


@Injectable({
  providedIn: "root"
})
export class ApiService {

  private socket;

  baseUrl: string;
  xcoreUrl: string;
  pageID: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
    this.xcoreUrl = environment.xcoreUrl;
  }

  get userId() {
    return JSON.parse(window.localStorage.getItem('localuser')).id;
  }

  get userToken() {
    return JSON.parse(window.localStorage.getItem("localuser")).token;
  }



  
  // update the user info in the DB after filling the form
  updateUser(user) {
    
    // return this.http.post('http://client-rest.kpeiz.localcrud', {
      return this.http.put(`${this.baseUrl}crud/${this.userId}/User`, {
        "object": user,
        "token": this.userToken
      }
      );
    }
  
  /*-----------------------------
    Generic methods 
  -----------------------------*/

  get(endpoint){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });

    return this.http.get<any>(`${this.baseUrl}${endpoint}`, {headers: headers})
  }

  asyncGet(endpoint: string){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });

    return this.http.get<any>(`${this.baseUrl}${endpoint}`, {headers: headers}).pipe(
      map(async res => await res)
    )
  }

  post(endpoint: string, body: {}){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });

    return this.http.post<any>(`${this.baseUrl}${endpoint}`,body,{headers: headers})
  }


  put(endpoint:string, body:{}){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
      return this.http.put(`${this.baseUrl}${endpoint}`, body, {headers: headers})
  }

  delete(endpoint:string){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });

    return this.http.delete(`${this.baseUrl}${endpoint}`, {headers: headers});
  }

  print(token: string){
    return this.http.get(`${this.baseUrl}token/report/create/${token}`).pipe(
        map(async res=> await res)
      );
  }
  getReportPrintData(token: string){
    return this.http.get(`${this.baseUrl}token/report/${token}`).pipe(
        map(async res=> await res)
      );
  }


  
// Connects to the socket
  public initSocket(): void {
    this.socket = socketIo(server_url);
  }


// Emits data to the socket 
  public sendToSocketId(){
    // this.socket.emit('core_message' ,"IT's ME MAAAAANNN! ");
    this.socket.emit('connect_user' ,this.userId);
  }
// Emits data to the socket 
  public sendToSocketevent(){
    // this.socket.emit('core_message' ,"IT's ME MAAAAANNN! ");
    this.socket.emit('connect_user' ,this.userId);
  }


// Reacts to messages from the Socket
  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('message', (data: any) => observer.next(data));
    });
  }
  uploadimage(image){
    let headers: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `"Bearer ${this.userToken}`
    });
    return this.http.post(`${this.baseUrl}upload-logo/reports`,{"image" :image},{headers: headers})
  }

  // post(endpoint: string, body: {}){
  //   let headers: HttpHeaders = new HttpHeaders({
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //     Authorization: `"Bearer ${this.userToken}`
  //   });

  //   return this.http.post<any>(`${this.baseUrl}${endpoint}`,body,{headers: headers})
  // }

}
