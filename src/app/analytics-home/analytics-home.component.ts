import { Component, OnInit, AfterContentInit, AfterViewInit, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ApiService } from '../api.service';
import { map } from 'rxjs/operators';
import { FacebookService } from '../facebook.service';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { ReportListComponent } from '../report-list/report-list.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SingletonService } from '../singleton.service';
import { UserPagesComponent } from '../user-pages/user-pages.component';
import { BenchmarksCreateComponent } from '../benchmarks-create/benchmarks-create.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrls: ['./analytics-home.component.scss']
})
export class AnalyticsHomeComponent implements OnInit {

  dashboards;
  dashboards_number = 0;
  benchmarks;
  benchmarks_number = 0;
  reports= [];
  dataSource = new MatTableDataSource<any>();

  constructor(public dialog: MatDialog, 
    private apiService: ApiService, 
    private fbService: FacebookService, 
    private singletonService: SingletonService,
    private snackBar: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit() {


    //#region getting dashboards list
    setTimeout(() =>
        this.apiService.get('dashboards').pipe(
        map(res=>{

          let _dashboards = {};

          //organize client data
          res.data.forEach(dashboard=>{
            _dashboards[dashboard.nd_type] = dashboard;
          })

          //get data from facebook
          this.fbService.fb_request(`&ids=${Object.getOwnPropertyNames(_dashboards).join(",")}&fields=cover,description,picture{url},name`).subscribe(pages => {
            
            //merge data
            Object.keys(_dashboards).forEach((dashboardId:any) => {      
              
              if(typeof pages[dashboardId]["cover"] != "undefined" )
                _dashboards[dashboardId]["image"] = pages[dashboardId]["cover"]["source"];

              if(typeof pages[dashboardId]["picture"] != "undefined" )
                _dashboards[dashboardId]["picture"] = pages[dashboardId]["picture"]["data"]["url"];
              
                if(typeof pages[dashboardId]["description"] != "undefined" )
                _dashboards[dashboardId]["description"] = pages[dashboardId]["description"];
              
                if(typeof pages[dashboardId]["name"] != "undefined" )
                _dashboards[dashboardId]["name"] = pages[dashboardId]["name"];
            });

          });

            //return mixed data
            return _dashboards;

        })
      ).subscribe(dashs => {
        if(dashs && Object.keys(dashs).length > 0){
          Object.keys(dashs).forEach(element => {
            if(!this.dashboards) this.dashboards = []
            this.dashboards.push(dashs[element]);
          })
        }else{
          this.dashboards = []
        }
        console.log('home_dashboards',this.dashboards);
        this.dashboards_number = this.dashboards.length
      }), 700);
    //#endregion


    //#region getting benchmarks list
    setTimeout(() => 
      this.apiService.get('benchmarks').pipe(map(res=>{

        let _dashboards = [];
        
        //organize client data
        res.benchmarks.forEach(benchmark=>{
          if(benchmark.accounts && benchmark.accounts != null){
            Object.keys(benchmark.accounts).forEach(account => {
              _dashboards.push(account);
            });
            
          }
        })


        //get data from facebook
        this.fbService.fb_request(`&ids=${_dashboards.join(",")}&fields=picture{url}`).subscribe(pages => {
      
          res.benchmarks.forEach((benchmark) =>{
            if(benchmark.accounts && benchmark.accounts != null){
              let accounts = [];
              Object.keys(benchmark.accounts).forEach((account)=> {
                if(pages[account] && pages[account]["picture"]){
                  benchmark.accounts[account]["picture"] = pages[account]["picture"]["data"]["url"];
                }
                accounts.push(benchmark.accounts[account]);
              });
              benchmark.accounts = accounts;
            }
          })

        });
        console.log('benchmarksss', res.benchmarks);
        
          //return mixed data
          return res.benchmarks;
      })
      ).subscribe(benchs => {
        if(benchs && Object.keys(benchs).length > 0){
          Object.keys(benchs).forEach(element => {
            if(!this.benchmarks) this.benchmarks = []
            this.benchmarks.push(benchs[element]);
          })
        }else{
          this.benchmarks = []
        }
        
        this.benchmarks_number = this.benchmarks.length
      // this.benchmarks = res.benchmarks;
    }), 700);
    //#endregion
    
    setTimeout(() => {
      console.log('analytics_home dashboards', this.dashboards);
      console.log('analytics_home benchmarks', this.benchmarks);
    }, 3000);
  } 

showReports(dashId, dashName){    
  const dialogRef = this.dialog.open(ReportListComponent, {
    data: {id: dashId, name: dashName},
    width: '800px',
    height: '550px'
  });

  dialogRef.afterClosed().subscribe(result => {     
    console.log('afterclosed', result);
    if(result) this.router.navigate(['app/analytics/reports/', result]);
  })
}

deleteDashboard(dashboard: any){
  let index = Object.keys(this.dashboards).find(key => this.dashboards[key] === dashboard);
  console.log(dashboard.id);

  const dialogRef = this.dialog.open(ConfirmationComponent, {
    data: {toDelete: 'Dashbord'},
    width: '300px',
    height: '150px'
  });

  dialogRef.afterClosed().subscribe(confirmation => {
    if(confirmation){
      this.apiService.delete(`crud/${dashboard.id}/Dashboard`).subscribe((res:any) => {
        if(res.errors == 0) delete this.dashboards[index];
      })
    }else return
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
      }
    })
  }

  goToPage(section){
    this.router.navigate(['app/analytics/'+section]);
  }


}
