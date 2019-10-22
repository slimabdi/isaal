import { MatDialog, MatSnackBar } from '@angular/material';
import { FacebookService } from './../facebook.service';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ReportListComponent } from '../report-list/report-list.component';
import { UserPagesComponent } from '../user-pages/user-pages.component';
 
@Component({
  selector: 'app-my-dashboards',
  templateUrl: './my-dashboards.component.html',
  styleUrls: ['./my-dashboards.component.scss']
})
export class MyDashboardsComponent implements OnInit, AfterContentInit {

  dashboards;
  // dashboardList: any;

  objectKeys = Object.keys

  constructor(private route: ActivatedRoute, 
    private apiService: ApiService, 
    private fbService: FacebookService, 
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }


  ngOnInit() {
    let _map = {"image":"cover.source", "name":"name", "description":"description"};
    //get data from client
    setTimeout(() => {
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
          
          // this.dashboards = []
        })
    }, 500);
  }

  ngAfterContentInit(){
    
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


  showReports(dashId, dashName){    
    const dialogRef = this.dialog.open(ReportListComponent, {
      data: {id: dashId, name: dashName},
      width: '800px',
      height: '550px'
    });
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

}
