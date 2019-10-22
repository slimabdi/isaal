import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(private http: HttpClient) { }

  get fbToken() {
    return JSON.parse(window.localStorage.getItem("localuser")).providers[0].provider_usertoken;
  }

  getFbUser() {
    return this.http.get(`https://graph.facebook.com/me/?access_token=${this.fbToken}&fields=picture.type(large)`)
  }

    // get all user's pages info from facebook graph
    getFbPages() {
      return this.http.get(
        `https://graph.facebook.com/me/accounts?access_token=${this.fbToken}&fields=about,picture,name,fan_count`
      );
    }

  fb_request(endpoint) {
    let base = `https://graph.facebook.com/?1`;
    return this.http.get<any>(`${base}${endpoint}&access_token=${this.fbToken}`);
  }

  getFbPage(pageID: string) {
    console.log(this);
    return this.http.get(`https://graph.facebook.com/${pageID}?access_token=${this.fbToken}&fields=about,picture{url},name,link,fan_count,cover.type(large){source},locations,access_token`).pipe(
      map(async res => await res)
    )
  }

  getPageGlobal(pageID: string) {
    return this.http.get(`https://graph.facebook.com/${pageID}/locations?access_token=${this.fbToken}`).pipe(
      map(async res => await res)
    )
  }

  // asyncGetFB(endpoint, fields){
  //   return this.http.get(`https://graph.facebook.com/${endpoint}?access_token=${this.fbToken}&field=${fields}`)
  //     .pipe(
  //       map(async res => await res )
  //     )
  // }

  getFbPage2(pageID: string) {
    return this.http.get(`https://graph.facebook.com/${pageID}?access_token=${this.fbToken}&fields=about,picture{url},name,link,fan_count,cover.type(large){source},access_token`);
  }

  getPost(pageID: string, postID: string){
    // 290505524488019_900478246824074?fields=id,full_picture,created_time,link,shares,message
    return this.http.get(`https://graph.facebook.com/${pageID}_${postID}?access_token=${this.fbToken}&fields=full_picture,created_time,link,message`).pipe(
      map(async res => await res)
    )
  }

getinstagram(){
  return this.http.get(`https://graph.facebook.com/me/?access_token=${this.fbToken}&fields=instagram_business_account`)
}
  
}
