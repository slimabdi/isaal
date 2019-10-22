import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SingletonService } from './singleton.service';
import {Configuration} from './configuration'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[]
})
export class AppComponent implements OnInit {

  language :string;

  constructor(private translate : TranslateService, private singletonService: SingletonService, public traduction : Configuration){
    translate.setDefaultLang('en');
    
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  
  ngOnInit(){   
    this.singletonService.current_screen_width = window.innerWidth;
    this.singletonService.current_screen_height = window.innerHeight;
    this.language = localStorage.getItem('localeId')
    this.translate.use(this.language);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.singletonService.current_screen_width = window.innerWidth;
    this.singletonService.current_screen_height = window.innerHeight;
    // console.log('current_screen_width');    
    document.documentElement.style.setProperty("--current_screen_width", this.singletonService.current_screen_width+'px');
    document.documentElement.style.setProperty("--current_screen_height", this.singletonService.current_screen_height+'px');
  }
  

}
