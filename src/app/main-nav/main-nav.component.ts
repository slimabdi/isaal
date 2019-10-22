import { FacebookService } from './../facebook.service';
import { TranslateService } from "../translate.service";
import { CreateReportComponent } from './../create-report/create-report.component';
import { UserPagesComponent } from './../user-pages/user-pages.component';
import { ApiService } from './../api.service';
import { Router, ActivatedRoute, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { AuthenticationService } from './../auth/authentication.service';
import { Config } from './../config';
import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { speedDialFabAnimations } from "./fab";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BenchmarksCreateComponent } from '../benchmarks-create/benchmarks-create.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { TeamManagementComponent } from '../team-management/team-management.component';
import { GlossaryComponent } from '../glossary/glossary.component';
import { SingletonService } from '../singleton.service';

import {Configuration} from '../configuration'

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  animations: speedDialFabAnimations
})
export class MainNavComponent implements OnInit {

  context = this;
  //#region fab button
  fabButtons = [
    {
      icon: "fas fa-chart-bar",
      color: "purple",
      name: "Dashboard",
      function: "addPage()"
    },
    {
      icon: "fas fa-file-alt",
      color: "slateblue",
      name: "Report",
      function: 'reportModal()'
    },
    {
      icon: "fas fa-chart-line",
      color: "mediumorchid",
      name: "Benchmark",
      function: "addBench()"
    }
  ];
  buttons = [];
  fabTogglerState = "inactive";
  //#endregion

  objectKeys = Object.keys;
  tools = [];
  section: string;
  dashboard_name: string;
  setOutlet: boolean = false;

  name: string;
  path: string;

  img_source: string;


  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches)
  //   );

  constructor(private breakpointObserver: BreakpointObserver,
    private config: Config,
    private authentificationService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    public translate: TranslateService,
    private fbService: FacebookService,
    private singletonService: SingletonService,
    public traduction : Configuration
  ) {

    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.setPath(e)
      }
    })
  }


  ngOnInit() {

    for (let key of this.objectKeys(this.config.navTree)) {
      this.tools.push(this.config.navTree[key])
    }


    this.fbService.getFbUser().subscribe(res => {
      this.img_source = res['picture'].data.url;
    });

    // this.apiService.get('auth/me').subscribe(res => {
    //   this.authorized = res.role_id == 0 ? true : false;
    // })
  }
  
  decode_utf8(s) {
    return decodeURIComponent(s);
  }


  setPath(e: NavigationEnd) {
    
    let url = e.url.split('/').filter(u => u != "");
    console.log('activeLink url', e.url);

    // url[0] = app
    // url[1] = analytics
    if ((url.length == 4 || url.length == 5)) {
      if (url[2] == "dashboards" || url[2] == "benchmarks") {
        if (url.length == 4)
          console.log("i don't have a name for this dashboard -check ur url");
        else {
          // this.name = url[4].split('%20').join(' ').split('%C3%A9').join('é');          
          this.name = decodeURIComponent(url[4]);
          this.path = url[2];
        }
      }
    }
    else if (url.length == 3) {
      this.name = "";
      this.path = url[2];
    }

    console.log('activeLink name', this.name);
    console.log('activeLink path', this.path);

  }

  openGlossary(){
    this.dialog.open(GlossaryComponent,{
      width:'800px',
      height: '600px'
    })    
  }

  logout() {
    this.authentificationService.logout().subscribe((res: any) => {
      console.log(res);
      if (res) {
        
        window.localStorage.clear();
        // this.router.navigate(['/login'])
        //   .then(res => console.log(res))
        //   .catch(err => console.log(err))
        (<Window>window).location.href = 'https://preprod.kpeiz.digital'
      }

    })
  }

  addBench() {
    const dialogRef = this.dialog.open(BenchmarksCreateComponent, {
      width: '800px',
      height: '500px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.snackBar.open('Benchmarks successfully added', '✔', { duration: 1500 });
        // this.router.navigated = false;
        this.router.navigateByUrl('app/analytics/home', {skipLocationChange: true}).then(()=>{
          this.router.navigate(["app/analytics/benchmarks"])
        }
        
        );
        // this.router.navigate(['app/analytics/benchmarks'])
      }
      this.onToggleFab()
    })
  }

  addPage() {
    // this.router.navigate(['app/analytics/page-add'])
    const dialogRef = this.dialog.open(UserPagesComponent, {
      width: '600px',
      height: '400px',

    });
    dialogRef.afterClosed().subscribe(result => {     
      if ((typeof result)!='undefined' && result[0] == true) {
          this.snackBar.open('page successfully added', '✔', { duration: 1500 });
          this.router.navigateByUrl('app/analytics/home', {skipLocationChange: true}).then(()=>{
            this.router.navigate(['app/analytics/dashboards', result[1], result[2]])
          })
        }
      this.onToggleFab()
    })
  }

  editProfile(){
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '800px',
      height: '800px',
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(r =>{
      console.log(r);
    })
  }

  manage(){
    const dialogRef = this.dialog.open(TeamManagementComponent, {
      width: '800px',
      height: '500px',
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(r =>{
      console.log(r)
    })
  }
  
  
  reportModal(){
    const dialogref = this.dialog.open(CreateReportComponent,{
      width: '600px',
      height: '400px',
      autoFocus: false
    })

    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      this.onToggleFab()
    })
  }

  chnageLang(lang:string){
    this.traduction.traduction= lang ? lang :'en';
    localStorage.setItem('localeId', this.traduction.traduction);
    this.translate.use(this.traduction.traduction);
  }


  // *************** Fab button functions
  showItems() {
    this.fabTogglerState = "active";
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = "inactive";
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }


  fireFunction(functionName) {
    eval(`this.${functionName}`);
  }

  

}


