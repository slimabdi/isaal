import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuardService implements CanActivate {

  constructor(private authentificationService: AuthenticationService ,private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    return this.authentificationService.isAuthenticated().pipe(
      map(isOk => {
        if(isOk) return true;
        // this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
        // this.router.navigate(['https://preprod.kpeiz.digital'])
        // .then(res=>console.log(res))
        // .catch(err=>console.log(err))
        window.location.href = 'https://preprod.kpeiz.digital';
        return false;
      })
    )

    // let localuser = JSON.parse(window.localStorage.getItem('localuser'));

    // if(localuser!=null && localuser.status == 2) return true;
    // return false;
  }
}
