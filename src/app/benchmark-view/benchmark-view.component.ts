import { ApiService } from './../api.service';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { MatSnackBar } from '@angular/material';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-benchmark-view',
  templateUrl: './benchmark-view.component.html',
  styleUrls: ['./benchmark-view.component.scss']
})
export class BenchmarkViewComponent implements OnInit, AfterViewInit, OnDestroy {

  widgets = [];
  benchmarkID;
  benchmarks: any = [];
  options: GridsterConfig;
  since: Date;
  until: Date;
  range:Range = { fromDate : new Date(), toDate : new Date()} ;
  layoutSaved = true;
  datePickerOptions:NgxDrpOptions;
  presets:Array<PresetItem> = [];

  social_accounts = [];

  lottieConfig;

  // depending on the role of the user
  authorized = false;

  constructor(private route: ActivatedRoute, 
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private singleton: SingletonService) {
      this.lottieConfig = {
        path: '../../assets/img/kpeiz_loading_logo.json',
        renderer: 'svg',
        autoplay: true,
        loop: true
      };
   }

  

  ngOnInit() {

    let benchmarkDateRange = JSON.parse(window.localStorage.getItem('benchmarkDateRange'));
    console.log('benchmarkDateRange',benchmarkDateRange);
    if(benchmarkDateRange){
      this.since = new Date(benchmarkDateRange.since);
      this.until = new Date(benchmarkDateRange.until);
    }
    else{
      let t = new Date();
      this.until = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1);
      this.since = new Date(this.until.getFullYear(), this.until.getMonth(), this.until.getDate() - 14); 
    }
    
    console.log("Since", this.since);
    console.log("Until", this.until);
    
    this.range= {fromDate:this.since, toDate: this.until };

    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.None,
      pushItems: true,
      swap: true,
      margin: 20,
      mobileBreakpoint: 768,
      maxCols: 12,
      minCols: 12,
      minRows: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      itemChangeCallback: this.itemChange.bind(this),
      itemResizeCallback: this.itemResize.bind(this),
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'd-handle',
        stop: this.resizingStop.bind(this),
        //stop: DragComponent.eventStop,
        //start: DashComponent.eventStart,
        dropOverItems: false,
        //dropOverItemsCallback: DragComponent.overlapEvent,
      },
      resizable: {
        enabled: true,
        stop: this.resizingStop.bind(this),
      }
    };

    this.setupPresets();
    new Date();
    
    this.datePickerOptions = {
                    presets: this.presets,
                    format: 'mediumDate',
                    range: { fromDate:this.since , toDate: this.until },
                    applyLabel: "Submit",
                    calendarOverlayConfig: {
                      shouldCloseOnBackdropClick: false,
                    }
                  };    

    this.apiService.get('auth/me').subscribe(res => {
      this.authorized = res.role_id == 0 ? true : false;
    })

  }

  ngAfterViewInit() {
    this.route.params.
      subscribe((params: Params) => {
        console.log(params.benchmarkID);

        this.benchmarkID = params['benchmarkID'];
        console.log(this.benchmarkID);
      })

    this.apiService.asyncGet(`benchmarks/${this.benchmarkID}`).subscribe(p => {
      p.then((data: any) => {
        console.log('benchmark_data',data);
        this.widgets = data.data && data.data.widgets ? data.data.widgets : null;
        if(this.widgets.length == 0) this.widgets = null;
        this.social_accounts = data.accounts;
        
      }).then(() => {

        if(this.widgets != null){
          this.widgets.forEach((widg, i = 0) => {
            if (widg.widget_position && widg.widget_size) {
              let rows;
              if(widg.uid == 'benchmark_table')
                rows = Number((this.social_accounts.length * this.singleton.getWindowSize().benchmark_table_row_height / 112).toFixed())  + 1;
                
              this.benchmarks.push({
                cols: +widg.widget_size.split('x')[0],
                rows: rows ? rows : +widg.widget_size.split('x')[1],
                y: +widg.widget_position.split('x')[1],
                x: +widg.widget_position.split('x')[0],
                data: widg
              })
            }
          });
        }

        console.log('benchmarks data:', this.widgets);
        this.layoutSaved = true;
        // this.toggleLayoutSavingButton();
      })
    })
  }


  // changeDate(value) {
  //   this.since = value[0];
  //   this.until = value[1];

  //   window.localStorage.setItem('benchmarkDateRange', JSON.stringify( 
  //     {'since': this.since, 'until': this.until} 
  //   ));
  //   //refresh the posts list
  //   this.singleton.posts = {}
  // }
  

  saveLayout() {
    let layout = [];
    this.benchmarks.forEach(widg => {
      layout.push({ 'id': widg.data.id, 'cols': widg.cols, 'rows': widg.rows, 'x': widg.x, 'y': widg.y });
    })

    this.apiService.put('updateLayout', {'widgets': layout }).subscribe(res => {
      //console.log(res);
      this.snackBar.open('layout updated and saved!', '✔', { duration: 2000 });
      this.layoutSaved = true;
    })
  }
  
  itemChange(item) {
    
  }

  itemResize(item) {
    
  }

  changedOptions() {
    setTimeout(() => {
      this.options.api.optionsChanged();
    }, 700);
  }

  removeItem(item) {
    this.benchmarks.splice(this.benchmarks.indexOf(item), 1);
  }

  addItem() {
    //this.benchmark.push({});
  }

  getDate (d) {
    return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }

  updateRange(range: Range){
    this.since = range.fromDate;
    this.until = range.toDate;

    window.localStorage.setItem('benchmarkDateRange', JSON.stringify( 
      {'since': this.since, 'until': this.until} 
    ));
    //refresh the posts list
    this.singleton.posts = {}
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

    ngOnDestroy(){
      this.singleton.reset();
    }


    resizingStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
    
      let old_item_x: number = item.x
      let old_item_y: number = item.y
      let old_item_col: number = item.cols
      let old_item_row: number = item.rows
      
      let new_item_x: number = itemComponent.$item.x
      let new_item_y: number = itemComponent.$item.y
      let new_item_col: number = itemComponent.$item.cols
      let new_item_row: number = itemComponent.$item.rows
  
      if(old_item_x !== new_item_x 
        || old_item_y !== new_item_y 
        || old_item_col !== new_item_col 
        || old_item_row !== new_item_row){
          
          console.log('resizingStop item changed!');
          this.layoutSaved = false;
        }
          
  
    }
    

}
