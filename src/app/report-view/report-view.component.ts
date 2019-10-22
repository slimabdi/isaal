import { WidgetComponent } from './../widget/widget.component';
import { ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ApiService } from './../api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid } from 'angular-gridster2';
import {Configuration} from "../configuration"

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
  
})
export class ReportViewComponent implements OnInit, AfterViewInit {
  
    @ViewChildren('gridster', {read: ElementRef}) gridster: QueryList<any>;
    @ViewChildren(WidgetComponent, {read: ElementRef}) _widgetsElements;
    @ViewChildren('widget') _widgets : QueryList<any>;
    @ViewChildren('pritables') pritables : QueryList<ElementRef>
  
  reportID;

  options: GridsterConfig;

  widgets = [];
  dashboard: any = [];

  texts;

  layoutSaved;

  since;
  until;
  report; 

  textExist: any[] = [];
  pages: any[] = [];
  currentComment = ""

  constructor(public configuration: Configuration,private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.reportID = params['reportID'];
        console.log(this.reportID);
      }
    )
     
    this.layoutSaved = true;

    // Gridster Options
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.OnDragAndResize,
      pushItems: true,
      swap: true,
      margin: 10,
      mobileBreakpoint: 640,
      maxCols: 12,
      minCols: 12,
      minRows: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.itemResize,
      draggable: {
        delayStart: 0,
        enabled: false,
        ignoreContentClass: 'gridster-item-content',
        //ignoreContent: false,
        dragHandleClass: 'd-handle',
        //stop: DragComponent.eventStop,
        //start: DashComponent.eventStart,
        dropOverItems: false,
        //dropOverItemsCallback: DragComponent.overlapEvent,
      },
      resizable: {
        enabled: true
      },

    };

  }


  ngAfterViewInit(){

    this.apiService.asyncGet(`reports/${this.reportID}`).subscribe(p=>{
      p.then(res=> {

        console.log('getting report:',res);
        this.report = res.data.report;
        this.texts = res.data.texts;
        this.pages = res.data.pages;


        this.since = new Date(res.report.start_date);
        this.until = new Date(res.report.end_date);
        
        })
        .then(()=>{
          if (this.pages && this.pages != null){
              this.pages.forEach((page, i=0)=> {
              page.widgets.forEach(widget=> {
                    widget["cols"] = +widget.widget_size.split('x')[0];
                    widget["rows"] = +widget.widget_size.split('x')[1];
                    widget["y"] = +widget.widget_position.split('x')[1];
                    widget["x"] = +widget.widget_position.split('x')[0];

                    if(widget.uid=="text") {
                      if(!this.texts[page]) {
                        console.log("creating texts page", i);
                        
                        this.texts[i] = [];
                      }
                      
                      console.log("creating texts page widget ", page,widget.uid);
                      this.texts[i][widget.uid]=null;
                    }
                  });

                })
              }
              if(this.texts.length>0){
                this.texts.forEach((page, i=0) => {
                  this.textExist[i]= {};
                  Object.keys(page).forEach((widget:any) => {

                    if(this.texts[i][widget] !=null){
                      this.textExist[i][widget] = true;
                    }else {
                      this.textExist[i][widget] = false;
                    }                  
                  });
                });
              }else{
                this.pages.forEach((page, i=0) =>{
                  page.widgets.forEach(widget => {
                    if(widget.uid == 'text'){
                      
                    }
                  })
                })
              }
              console.log("this.textExist", this.textExist);
              
 
            });


          })
  }
 
  quillExist($event){
   
    if(this.texts.length>0 && $event==true){

      this.texts.forEach((page, i=0) => {
        Object.keys(page).forEach(widget => {
          if(this.texts[i][widget] != null && document.querySelector(`#text_${i}_${widget} .ql-container .ql-editor p`) !=null ){
            document.querySelector(`#text_${i}_${widget} .ql-container .ql-editor p`).textContent = this.texts[i][widget];
          }
        });
      });
    }
    
  }

  showQuill(event){
    console.log(this.textExist);
    this.textExist[event.page][event.wref] = true;
  }

  save(){

    let output = {};
    this._widgets.forEach((widget, i=0) => {
      
      if(widget.widget.uid=="text") {
        
        if(!output[widget.page])
          output[widget.page] = {};
          
        if(this._widgetsElements._results[i].nativeElement.querySelector("p")!=null){
            if(this._widgetsElements._results[i].nativeElement.querySelector("p").textContent !=''){
              output[widget.page][widget.wref] = this._widgetsElements._results[i].nativeElement.querySelector("p").textContent;
            } else{
              output[widget.page][widget.wref] = null;
            }
        }
      }
      
    })
    
    let o= [];
    this.pages.forEach((page, i=0)=> {
      let p = Object.assign({}, page.widgets);

      let tmp = {"widgets":p, "number":i, "name":"test", "status":1};
      o.push(tmp);
    });

    console.log("OOOOO", o);
    
    
    let payLoad = {
      "report" : o,
      "texts": output 
    }
    console.log("PAYLOAD", payLoad);
    
    this.apiService.put(`reports/${this.reportID}/edit`, payLoad ).subscribe(res=>console.log(res))  
  }

  itemChange(item) {
    //console.info(item.data.name, 'repositioned to: x:', item.x, 'y:', item.y);
    //this.layoutSaved = false;

    // this.toggleLayoutSavingButton();

    // console.info(item.data.name, 'repositioned');
  }

  itemResize(item) {
    //console.info(item.data.name, 'resized to: cols:', item.cols, 'rows:', item.rows);
    // DashComponent.toggleLayoutSavingButton();
    // console.info(item.data.id, 'resized');
    // console.log(this.layoutSaved);
    //this.layoutSaved = false;
    // console.log(this.layoutSaved);
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }
  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }


  // Still to be tested after report generation
  deletePage(i){
    if(this.pages.length>0){
      this.pages[i].status=0;
      this.pages = this.pages;
      // this.pages.splice(i,1);
    }
  }

  print(){
    this.save();
  
    this.apiService.post('token/report/create', {'id': this.reportID, 'expiration': 60}).subscribe(res => {
      console.log(res);
      if(res.status==200)
        this.router.navigate(['/print-report',this.reportID,res.token])

    })
  }

  //upload image 
  selectedFile : any;

  onFileChanged(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile  = event.target.files[0];
    console.log("file image" , this.selectedFile )
    reader.readAsDataURL(this.selectedFile );
    reader.onload = (event:any) => {
      this.configuration.url  = event.target.result;
    }
    this.apiService.uploadimage(this.selectedFile).subscribe(res =>{
      console.log("resulat upload",res)
      
    })
  }
  }
}
