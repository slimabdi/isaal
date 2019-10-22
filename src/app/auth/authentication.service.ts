import { ApiService } from './../api.service';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { Observable, of } from 'rxjs';
import { AuthService } from 'angularx-social-login';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user$: Observable<SocialUser>;
  baseUrl: string;


  constructor(private authService: AuthService, private http: HttpClient, private apiService: ApiService) {
    this.baseUrl = environment.baseUrl;
    this.user$ = authService.authState;
  }

  getUser(): Observable<SocialUser> {
    return this.user$;
  }

  singInWithGoogle() {
    // Signin return a promise that should be caught
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(res => console.log(res))
      .catch(err => console.log("Login canceled", err))
  }

  signInWithFacebook() {
    // Signin return a promise that should be caught
    return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)

  }

  logout() {
    // Signin return a promise that should be caught
    // this.authService.signOut()
    //   .then(res => console.log(res))
    //   .then(err => console.log(err))
    return this.http.post(`${this.baseUrl}auth/logout`, { "token": this.apiService.userToken })
  }

  signup(user: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}signup`, user);

  }

  isAuthenticated(): Observable<boolean>{
    // Should return true or false based on the validaty of the token -> used as a guard
    let t ="";
    
    if(window.localStorage.getItem('localuser') != null)  t = this.apiService.userToken ;

      return this.http.post(`${this.baseUrl}auth/payload`, { 'token': t })
        .pipe(
          map((res: HttpResponse<any>) => {
          return res.ok
          })
        )
        .pipe(
          catchError((err :HttpErrorResponse)=> {
            if(err.status ==401 || err.status ==500 )
              return of(false)
          })
        )
  }
}
