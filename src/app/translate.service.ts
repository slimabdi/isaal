import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  data: any = {};

  constructor(private http: HttpClient) { }

  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {

      const langPath = `assets/translate/${lang || 'fr'}.json`;

      this.http.get<{}>(langPath).subscribe(

        translation => {
          console.log('transa',translation)
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });


  }
}
