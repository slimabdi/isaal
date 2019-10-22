import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Config } from '../config'
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss']
})
export class NavTabsComponent implements OnInit {
  objectKeys = Object.keys;
  features = {};
  tool;
  navTree;
  activeLink;

  opened = false;

  constructor(private elementRef: ElementRef, 
    private config: Config, 
    private router: Router,
    private singletonService: SingletonService
    ) {
    
  }

  ngOnInit() {
    this.navTree = this.config.navTree;
    
    
    //this.tool = this.elementRef.nativeElement.parentElement.localName;
    this.tool = 'analytics';
    this.features = this.navTree[this.tool].features;    
    console.log('this.features', this.features);
    
    // this.navigate();
    // this.router.events.subscribe(e => {
    //   if (e instanceof NavigationEnd) {
    //     this.navigate();
    //   }
    // })
    this.navigate();
    // this.singletonService.navigate();
    //this.activeLink = 'analytics/' + this.features['dashboards'].route;
    //console.log('this.activeLink',this.activeLink);
    
    //this.router.navigate([`app/analytics/${this.activeLink}`]);

  }

 
  navigate() {
    let feature = this.router.routerState.snapshot.url.split('/').filter(s => s != "");
        
    // /app/analytics/home
    if (feature.length == 3) {
      this.activeLink = 'analytics/' + this.navTree["analytics"].features[feature[feature.length - 1]].route;
    }
    // /app/analytics/dashboard/1
    else if (feature.length == 4) {
      this.activeLink = 'analytics/' + this.navTree["analytics"].features[feature[feature.length - 2]].route;
    }
    // /app/analytics/dashboard/1/ooredooTn
    else if (feature.length == 5) {
      this.activeLink = 'analytics/' + this.navTree["analytics"].features[feature[feature.length - 3]].route;
    }
    else {
      this.activeLink = 'analytics/' + this.navTree["analytics"].features['home'].route;
    }

  }

  toggleMenu(){
    this.opened = this.opened ? false : true;
  }

}
