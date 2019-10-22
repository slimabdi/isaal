import { ActivatedRoute, Params } from '@angular/router';
import { AfterViewInit } from '@angular/core';
import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-print',
  templateUrl: './report-print.component.html',
  styleUrls: ['./report-print.component.scss']
})
export class ReportPrintComponent implements OnInit, AfterViewInit {

  reportID;
  widgets = [];
  dashboard: any = [];

  comments;

  layoutSaved;

  since;
  until;
  report;
  token : string;

  textExist: any[] = [];

  pages: any[] = [];


  constructor(private apiService : ApiService, private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.reportID = params['reportID'];
        this.token = params['token']
      }
    )

    this.apiService.getReportPrintData(`${this.token}`).subscribe(p=>{
      p.then((res:any)=> {

        console.log('getting report:',res);
        this.report = res.data.report;
        this.comments = res.data.texts; 
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
                  });

                })
              }
                this.render_comments()
                // .then((element)=>{
                //   console.log("ELEMENT", document.querySelector(element));

                // });
            });
          })


  }
 render_comments(){
    if(this.comments.length>0){
      this.comments.forEach((page, i=0) => {
        console.log("page",i ,page)
        this.textExist[i]= {};
        Object.keys(page).forEach((widget:any) => {
          console.log("widget",widget)
          console.log(this.comments[i][widget]);

          this.textExist[i][widget] = false;
          document.querySelector(`.fake-placeholder`);
          
          setTimeout(()=>{
            console.log("ELEMENT", document.querySelector(`.printable_comment-text_${i}_${widget}`));
            document.querySelector(`.printable_comment-text_${i}_${widget}`)
            if(this.comments[i][widget]!=null && document.querySelector(`.printable_comment-text_${i}_${widget}`)!=null)
              document.querySelector(`.printable_comment-text_${i}_${widget}`).textContent = this.comments[i][widget];

          },1000)          

          // let element = `.fake-placeholder_${i}_${widget}`; 
          // return new Promise<string>();

          // document.querySelector(`.fake-placeholder_${i}_${widget} span`).textContent = this.comments[i][widget]
          
          // if(this.comments[i][widget] !=null){
          //   this.textExist[i][widget] = false;
          //   document.querySelector(`.fake-placeholder${i}_${widget} span`).textContent = this.comments[i][widget]
          // }else {
          //   this.textExist[i][widget] = true;
          // }                  
        })
      });
    }
  }
  ngAfterViewInit(){
    // if(this.comments.length>0){                          
    //   this.comments.forEach((page, i=0) => {
    //     Object.keys(page).forEach(widget => {
    //       if(this.comments[i][widget]!=null)
    //         document.querySelector(`.fake-placeholder${i}_${widget} span`).textContent = this.comments[i][widget]
    //     });
    //   });
    // }
  }

  quillExist($event){
    if(this.comments.length>0 && $event==true){
                                
      this.comments.forEach((page, i=0) => {
        Object.keys(page).forEach(widget => {
            document.querySelector(`#text_${i}_${widget} .ql-container .ql-editor p`).textContent = this.comments[i][widget]         
        });
      });
    }
    
  }

}
