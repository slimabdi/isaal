import { Observable } from 'rxjs';
import { ApiService } from './../api.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BenchmarksCreateComponent } from '../benchmarks-create/benchmarks-create.component';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { FacebookService } from '../facebook.service';

@Component({
  selector: 'app-benchmark-list',
  templateUrl: './benchmark-list.component.html',
  styleUrls: ['./benchmark-list.component.scss'],
  providers: [BenchmarksCreateComponent]
})
export class BenchmarkListComponent implements OnInit, OnChanges {

  // userbenchmarks$:Observable<any>;
  userbenchmarks$;

  constructor(private apiService: ApiService, 
    private fbService: FacebookService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
    ) { }

  init() {
    

    setTimeout(() => {
      //this.userbenchmarks$ = this.apiService.get('benchmarks');
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
            if(!this.userbenchmarks$) this.userbenchmarks$ = [];
            this.userbenchmarks$.push(benchs[element]);
          })
        }else{
          this.userbenchmarks$ = []
        }
        
        // this.userbenchmarks$ = []
      // this.benchmarks = res.benchmarks;
    });

    }, 500);
  }
  ngOnInit() {
    this.init();

    // this.apiService._request('benchmarks').subscribe(res=>console.log(res)    )
  }

  ngOnChanges(){
      // this.userbenchmarks$ = this.apiService.get('benchmarks');
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
        Object.keys(benchs).forEach(element => {
          this.userbenchmarks$.push(benchs[element]);
        })
      // this.benchmarks = res.benchmarks;
    });
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

}
