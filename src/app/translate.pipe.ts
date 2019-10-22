import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(key: any): any {
      return this.translate.data[key] ? (this.translate.data[key].charAt(0).toUpperCase() + this.translate.data[key].substr(1).toLowerCase()) : key

  }
}
