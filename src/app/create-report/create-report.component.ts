import { AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from './../api.service';
import { NgForm, FormControl } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit, AfterViewInit {
  @ViewChild('f') f : NgForm;
  @ViewChild('dateRangePicker') dateRangePicker;
  
  dashboards;
  value;
  range:Range = {fromDate:new Date(), toDate: new Date()};
  options:NgxDrpOptions;
  presets:Array<PresetItem> = [];

  since: Date;
  until: Date;

  default=null;

  constructor(private apiService: ApiService, 
              private dialogref: MatDialogRef<CreateReportComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: any,) {

   }

  ngOnInit() {
    console.log(this.data);
    
    this.since = new Date();
    this.until = new Date(this.since.getFullYear(), this.since.getMonth()-1, this.since.getDay());

    console.log("Since",this.since);
    console.log("Until", this.until);

 
    this.setupPresets();
    this.options = {
                    presets: this.presets,
                    format: 'mediumDate',
                    range: {fromDate:this.since, toDate: this.until},
                    applyLabel: "Submit",
                    calendarOverlayConfig: {
                      shouldCloseOnBackdropClick: true,
                    }
                  };            
    }

    ngAfterViewInit(){
      this.apiService.asyncGet('dashboards')
      .subscribe(p=> {
          p.then(res=>{
          this.dashboards = res.data;       
      })
          .then(()=>{
            console.log(this.data);
            if(this.data!=undefined && this.dashboards!=undefined){
              this.default = this.data[0];
              const resetRange = {fromDate:this.data[1], toDate: this.data[2]};
              this.dateRangePicker.resetDates(resetRange);

              let s = this.dashboards.find(dash=> dash.id == this.data[0]);
              
              this.f.controls['reportName'].setValue(`${s.name} [${this.getDate(this.data[1])} - ${this.getDate(this.data[2])}]`);
              console.log(s);
              
            }
          })
      })

    }

    getSociAccChange(e){
      console.log(e.value);

      let s = this.dashboards.find(dash=> dash.id == e.value);      
      this.f.controls['reportName'].setValue(`${s.name} [${this.getDate(this.since)} - ${this.getDate(this.until)}]`);
      
    }

  generateReport(f: NgForm){
    console.log(f.value['reportName']);
    
    let report = {

      "name":f.value['reportName'],
      "start_date":this.getDate(this.since),
      "end_date":this.getDate(this.until),
      "dashboard_id": f.value['dashboard_id'],
      "data": ''
    }
    this.apiService.post('reports/create', report).subscribe(res=>{
      console.log(res);
      if(res.errors==0){
        this.dialogref.close();
        this.router.navigate(['app/analytics/reports',res.last_inserted_id]);
        this.apiService.sendToSocketevent()
      }
      
    })
  }

  getDate (d:Date) {
    return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }

  updateRange(range: Range){
    this.since =range.fromDate;
    this.until =range.toDate;
    console.log(this.f.controls['dashboard_id']);
    
    if(typeof this.dashboards != "undefined" && this.f.controls['dashboard_id'].value >0) { //if dashboards not loaded yet
      let s = this.dashboards.find(dash=> dash.id == +this.f.controls['dashboard_id'].value)
      console.log(s);
      console.log(this.f.controls['dashboard_id'].value);
      
      this.f.controls['reportName'].setValue(`${s.name} [${this.getDate(range.fromDate)} - ${this.getDate(range.toDate)}]`);
    }


  } 
    
  
  // helper function to create initial presets
  setupPresets() {
 
    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    }
    
    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7)
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth()+1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth()-1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    this.presets =  [
      {presetLabel: "Yesterday", range:{ fromDate:yesterday, toDate:today }},
      {presetLabel: "Last 7 Days", range:{ fromDate: minus7, toDate:today }},
      {presetLabel: "Last 30 Days", range:{ fromDate: minus30, toDate:today }},
      {presetLabel: "This Month", range:{ fromDate: currMonthStart, toDate:currMonthEnd }},
      {presetLabel: "Last Month", range:{ fromDate: lastMonthStart, toDate:lastMonthEnd }}
    ]
  }

}
