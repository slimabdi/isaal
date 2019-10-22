import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, LoginOpt, SocialLoginModule } from 'angularx-social-login';

const fbLoginOptions: LoginOpt = {
  scope: 'email,pages_show_list,manage_pages',
  return_scopes: true,
  enable_profile_selector: true,
}; 
 
const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; 
 
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("230100855695-bs3eejq1qltupamidhiu2ffkiahbjcgk.apps.googleusercontent.com", googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("651139668361432", fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}
@NgModule({
  imports: [
    CommonModule,
    SocialLoginModule
  ],
  exports: [

  ],
  providers:[
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],

  declarations: []
})
export class AuthModule { }
