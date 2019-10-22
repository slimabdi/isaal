import { FacebookService } from './../facebook.service';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService } from './../api.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subscription ,Observable} from 'rxjs';
import { NgForm } from '@angular/forms';
import * as _ from 'underscore';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { start } from 'repl';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'user-pages',
  templateUrl: './user-pages.component.html',
  styleUrls: ['./user-pages.component.scss'],
})
export class UserPagesComponent implements OnInit, OnDestroy, AfterViewInit {
      // pager object
      pager: any = {};
      iconeflesh = 'block'
    // paged items
    pagedItems: any[];
  pages: any[];
  fullPagesList: any[];
  provider_usertoken;
  requestedPage;
  setInterval;
  pageId;
  subscription: Subscription;
  isGlobal;
  userpageName = new FormControl();
  filtereddashbords: Observable<any[]>;
  searchString: string;
  //View Child for the page url form
  @ViewChild('f') f: NgForm;

  constructor(private apiService: ApiService, 
              private fbService: FacebookService,
              private router: Router, 
              private snackBar: MatSnackBar,
              private elementRef: ElementRef,
              ) { }

  ngOnInit() {    
    console.log(this.elementRef.nativeElement.parentElement.localName);    
  }

  ngAfterViewInit() {
console.log('searchString',this.searchString)
    console.log('localuser', window.localStorage.getItem('localuser'));

    if (JSON.parse(window.localStorage.getItem('localuser')) !== null) {

      this.subscription = this.fbService.getFbPages().subscribe((data: any) => {
        console.log("USER PAges FB response", data.data)

        let pagesIds = [];
        data.data.forEach((page: any) => pagesIds.push(page.id))

        // this.apiService
        this.pages = data.data;
        this.fullPagesList = data.data;
        
        if(this.pages.length < 5 || this.pages.length == 5){
          this.iconeflesh = 'none'
        }
        this.filtereddashbords = this.userpageName.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        )

        if (this.pages.length >= 12) {
          this.pages.splice(12, this.pages.length);
          console.log('this.filtereddashbords',this.filtereddashbords)
        }
        console.log("Pages", this.pages);
                // initialize to page 1
                this.setPage(1);

      });
    } else {
      console.log("user not logged in ");
    }
  }

  showMorePages() {
    // Navigate User to app with full lsit of page
    console.log("Should Navigate !");

    this.router.navigate(['/app/analytics/dashboards'])

  }

  onImageClick(pageId) {
    var pageUrl = `https://www.facebook.com/${pageId}`;

    this.f.controls['page'].setValue(pageUrl);
    // alert(pageUrl)
  }

  onSubmit(f: NgForm) {
    // debugger;

    console.log("form", f);

    let url = f.value.page.split('/');

    console.log("url", url);

    let pageName: string;


    if (url[url.length - 1] === "") {

      pageName = url[url.length - 2];
    } else {
      pageName = url[url.length - 1];
    }


    var re = /http[s]?:\/\/[www.facebook]+(?:\.[com]+)+\/(.[^\?|\/]*)/
    var res = f.value.page.match(re);
    if(+res[3] > 0) 
      this.pageId = +res[3]
    
    if (pageName) {
      this.fbService.getFbPage(pageName).subscribe(p => {
        p.then(res => {
          this.requestedPage = res;
        }).then(() => {
          this.fbService.getPageGlobal(pageName).subscribe(p => {
            p.then(res => {
              console.log("page_locations", res['data'])
              this.isGlobal = res['data'] && res['data'].length > 0 ? true : false;
              console.log("is_global", this.isGlobal)

            })
          })
        })
      })

    }

  }

  showAllPages() {
    this.pages = this.fullPagesList;
  }

  savePage() {
    
    let url = this.f.value.page.split('/');

    let pageName: string;

    if (url[url.length - 1] === "") {
      pageName = url[url.length - 2];
    } else {
      pageName = url[url.length - 1];
    }

    let page = {};

      page["remote_id"] = this.requestedPage.id;
      page["provider"] = "Facebook";
      page["url"] = this.f.value.page;
      page["title"] = this.requestedPage.name;
      page["nickname"] = pageName;
      page["description"] = this.requestedPage.about;
      if(this.requestedPage['cover'])
        page['cover'] = this.requestedPage.cover.source;
      if(this.requestedPage['access_token'])
        page['access_token'] = this.requestedPage.access_token;

      page['is_global'] = this.isGlobal;

      


    let pages = [];
    pages.push(page);

    console.log('adding social accounts', pages);    

    this.apiService.post('social-accounts/add', {'pages': pages}).subscribe((res: any) => {

      if (res.errors == 0) {

        this.snackBar.open("Page added successuly", "", { duration: 1500 })

        // this.apiService.asyncGet(`status/${res.dashboard}`).subscribe(p => {
          // p.then((data: any) => {
            // if(data.status==401){
            //     this.requestedPage["status"]='fetching'; 
            //     console.log("waiting...")
            //   }
              // if(data.status==200) {
                if(this.elementRef.nativeElement.parentElement.localName =='mat-dialog-container'){
                  this.router.navigate(['app/analytics/dashboards',res.dashboard.id, res.dashboard.name]);
                  (document.querySelector('button[hidden][mat-dialog-close]') as HTMLButtonElement).click()
                  // this.router.navigate(['app/analytics/dashboards',res.dashboard.id, res.dashboard.name]);
                }
                else{
                  window.top.location.href = `app/analytics/dashboards/${res.dashboard.id}/${res.dashboard.name}`;
                }
              // }
            // })    
          // })
        
      }
    })
  }

  ngOnDestroy() {
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

    getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage+2;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

  setPage(page: number) {
    console.log('this.pager.totalPages',this.pages.length)

    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    // get pager object from service
    this.pager = this.getPager(this.pages.length, page);
    // get current page of items
    this.pages = this.pages.slice(this.pager.startIndex, this.pager.endIndex + 1);
  
}

private _filter(value: string){
  const filterValue = value.toLowerCase();
  console.log('pagedItems',this.pages);
  
  return this.pages.filter(pages => pages.name.toLocaleLowerCase().includes(filterValue)); 
}

}
