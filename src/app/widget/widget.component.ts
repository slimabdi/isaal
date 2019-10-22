import { ActivatedRoute } from '@angular/router';
import { FormatPipe } from './../pipes/format.pipe';
import { FacebookService } from './../facebook.service';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewChild, NgZone, ElementRef, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { map, reduce } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort, Sort } from '@angular/material';
import { Chart } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { PostsComponent } from '../posts/posts.component'
import { SingletonService } from '../singleton.service';
import { Observable, from } from 'rxjs';


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})

export class WidgetComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('widget') widget;
  @Input('social_accounts') social_accounts;
  @Input('since') since;
  @Input('until') until;
  @Input('page') page;
  @Input('wref') wref;
  @Output('quillCreated') quillCreated: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @ViewChild(MatSort) sort: MatSort;
  
  //Test if the text exist to render Quill or fake placeholder
  @Input('textExist') textExist; 

  // Notify parent component if the fake placeholder is clicked to render the quill
  @Output('areaClicked') areaClicked : EventEmitter<{}> = new EventEmitter<{}>();
  
  
  widget_data: any;
  standardCharts = ['line', 'bar', 'pie'];
  pageName;
  page_picture;
  posts = {};

  benchmarkPages = {};
  postsPages = {};
  currentComment = "";
  dataSource: any[];
 
  options = {
    maintainAspectRatio: false,
    elements: {
      line: {
          tension: 0,
          fill: false
      }
    },
    tooltips: {
      intersect: false,
      mode: 'x',
      axis: 'x'
    },
    // onClick: this.chartItemClick
  }

  doughnutColors = [
    {
      backgroundColor: [
        '#6c92dc',
        '#ff534a',
        '#f9ba3d',
        '#333a6a',
        '#fb3e55',
        '#00c4da',
        '#f9ba3d'
      ]
    }
  ];

  lineColors = [
      {
        backgroundColor: '#6c92dc',
        borderColor: '#6c92dc'
      },
      {
        backgroundColor: '#ff534a',
        borderColor: '#ff534a'
      },
      {
        backgroundColor: '#f9ba3d',
        borderColor: '#f9ba3d'
      },
      {
        backgroundColor: '#333a6a',
        borderColor: '#333a6a',
      },
      {
        backgroundColor: '#fb3e55',
        borderColor: '#fb3e55'
      },
      {
        backgroundColor: '#00c4da',
        borderColor: '#00c4da'
      },
      {
        backgroundColor: '#f9ba3d',
        borderColor: '#f9ba3d'
      }
  ];

  // backgroundColor: [
      //   '#6c92dc',
      //   '#ff534a',
      //   '#f9ba3d',
      //   '#333a6a',
      //   '#fb3e55',
      //   '#00c4da',
      //   '#f9ba3d'
      // ]

  barColors = [
    {
      backgroundColor: '#6c92dc'
    },
    {
      backgroundColor: '#ff534a'
    },
    {
      backgroundColor: '#f9ba3d'
    },
    {
      backgroundColor: '#333a6a'
    },
    {
      backgroundColor: '#fb3e55'
    },
    {
      backgroundColor: '#00c4da'
    },
    {
      backgroundColor: '#f9ba3d'
    }
  ];

  pie_options = {
    maintainAspectRatio: false,
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
    elements: {
      line: {
          tension: 0,
          fill: false, // disables bezier curves
      }
    }
    //showAllTooltips: true
  }

  chart;

  printComponent=false;

  constructor(private apiService: ApiService,
              private fbService: FacebookService,
              public dialog: MatDialog,
              private format: FormatPipe,
              private singleton: SingletonService,
              private elementRef: ElementRef) { }

  ngOnInit() {
    Chart.pluginService.register({
			beforeRender: function (chart) {
				if (chart.config.options.showAllTooltips) {
					// create an array of tooltips
					// we can't use the chart tooltip because there is only one tooltip per chart
					chart.pluginTooltips = [];
					chart.config.data.datasets.forEach(function (dataset, i) {
						chart.getDatasetMeta(i).data.forEach(function (sector, j) {
							chart.pluginTooltips.push(new Chart.Tooltip({
								_chart: chart.chart,
								_chartInstance: chart,
								_data: chart.data,
								_options: chart.options.tooltips,
								_active: [sector]
							}, chart));
						});
					});

					// turn off normal tooltips
					chart.options.tooltips.enabled = false;
				}
			},
			afterDraw: function (chart, easing) {
				if (chart.config.options.showAllTooltips) {
					// we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
					if (!chart.allTooltipsOnce) {
						if (easing !== 1)
							return;
						chart.allTooltipsOnce = true;
					}

					// turn on tooltips
					chart.options.tooltips.enabled = true;
					Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            tooltip.initialize();
            //tooltip._options.position = "outer";
						tooltip.update();
						// we don't actually need this since we are not animating tooltips
						tooltip.pivot();
						tooltip.transition(easing).draw();
					});
					chart.options.tooltips.enabled = false;
				}
			}
    })
  }
  setCurrentComment(p,w) {
    this.currentComment = p+"_"+w;
    console.log("here");
    
  }

  
  ngOnChanges() {

    if (this.since != null && this.until != null && this.widget.uid!='text') {
      let t = this;

      console.log("widget_ from observable", this.widget);

      //widget for report : the data is cached and returned directly from cache
      if(this.widget.data && this.widget.data.length > 0 ){        
        this.widget_data = new Observable(observer => observer.next(this.widget.data)).pipe(
            map((res:any) => {
                //if widget got callback execute it.       
                if (this.widget.callback != "" && (this.widget.callback)!=null)
                  return eval("t." + this.widget.callback + "(JSON.parse(res))")
                else
                  return JSON.parse(res);
              })
            );
      } 
      //widget for dashboard.
      else{
        console.log("widget_ from rest api", this.widget);

        this.widget_data = this.apiService.get(`${this.widget['data_source']}&since=${this.getDate(this.since)}&until=${this.getDate(this.until)}`).pipe(
          map(res => {
            //console.log("wwwww",this.widget);
            //eval("t.adjust_" + this.widget.chart_type+ "(res)")
            //alert(this.widget.uid);
            // console.log('before',t);

            /*if(typeof t[this.widget.uid] === 'function') {
              //alert('got function '+this.widget.uid);
              // console.log('after',t[this.widget.uid]);
              return t[this.widget.uid](res)
              //return eval( + "")
            }
            else {*/
              if(typeof t[this.widget.chart_type] === 'function') {
                return t[this.widget.chart_type](res)
              }
            //}
            /*if (this.widget.callback != "" && (this.widget.callback)!=null)
              return eval("t." + this.widget.callback + "(res)")
            else
              return res;
              */
             return res;
            })
          )
      }

    }

  }

  line(data) {
    let datasets = [];
    let labels = [];

    if(data.data.length==0) {
      console.log("Exception #x0002152");
    }
    else if(data.data.length==1) {
      console.log("got only one account ");
    }
    else {
      Object.keys(data.data).forEach(accountId => {
        let account = data.data[accountId];

        //got multiple accounts AND only one metric to show
        if(account.data.length==1) {
          
        }
        //for each metric
        Object.keys(account.data).forEach(metric => {
          let metricData = account.data[metric];
          
          //for each day
          Object.keys(metricData.data).forEach(date => {
            let val = metricData.data[date];
            if (labels.indexOf(date) == -1)
              labels.push(date);

          })

          //tmp[metric] = metricData.data.values();
          datasets.push({ 
            data: Object.values(metricData.data) /*[86,114,106,106,107,111,133,221,783,2478]*/,
            label: account.info.nickname,
            //borderColor: "#3e95cd",
            //fill: false
          })
        })


      })
    }
    //console.log("line", datasets);
    
    let r= {"labels":labels, "datasets":datasets};
    console.log(r);;
    
    return r;
    /*
    {
      type: 'line',
      data: {
        labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
        datasets: [{ 
            data: [86,114,106,106,107,111,133,221,783,2478],
            label: "Africa",
            borderColor: "#3e95cd",
            fill: false
          }, { 
            data: [282,350,411,502,635,809,947,1402,3700,5267],
            label: "Asia",
            borderColor: "#8e5ea2",
            fill: false
          }, { 
            data: [168,170,178,190,203,276,408,547,675,734],
            label: "Europe",
            borderColor: "#3cba9f",
            fill: false
          }, { 
            data: [40,20,10,16,24,38,74,167,508,784],
            label: "Latin America",
            borderColor: "#e8c3b9",
            fill: false
          }, { 
            data: [6,3,2,2,7,26,82,172,312,433],
            label: "North America",
            borderColor: "#c45850",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'World population per region (in millions)'
        }
      }
    }
    */
  }
  benchmark_table(data) {
    console.log("here", data  );
     
    let _rows = [];
    
    Object.keys(data).forEach(element => {
      if (element != "total_count" && element != "avgs") {

        _rows.push({
          'id': element,
          'picture' : data[element].info.picture ? data[element].info.picture : 
          'https://scontent.fnbe1-1.fna.fbcdn.net/v/t1.0-1/c81.0.275.275/399548_10149999285987789_1102888142_n.png?_nc_cat=1&_nc_ht=scontent.fnbe1-1.fna&oh=4e4f88c4151c253a442eefe2696b092d&oe=5C7E3FA0',
          'link': 'https://facebook.com/'+data[element].info.remote_id,
          'pageName' : data[element].info.nickname,
          'Total_des_fans' : data[element].data.kpeiz_fan_count ? +data[element].data.kpeiz_fan_count : 0,
          'Nouveaux' : data[element].data.kpeiz_fans_variation ? +data[element].data.kpeiz_fans_variation : 0,
          'Admin' : data[element].data.kpeiz_post_count_by_date ? +data[element].data.kpeiz_post_count_by_date : 0,
          'Fans' : data[element].data.kpeiz_fans_posts_count ? +data[element].data.kpeiz_fans_posts_count : 0,
          'Total_des_interactions' : data[element].data.kpeiz_account_total_interactions ? +data[element].data.kpeiz_account_total_interactions : 0,
          'Reactions' : data[element].data.kpeiz_account_total_reactions ? +data[element].data.kpeiz_account_total_reactions : 0,
          'Commentaires' : data[element].data.kpeiz_account_total_comments ? +data[element].data.kpeiz_account_total_comments : 0,
          'Partages' : data[element].data.kpeiz_account_total_shares ? +data[element].data.kpeiz_account_total_shares : 0,
          'Page' : data[element].data.kpeiz_account_engagement_rate ? +(data[element].data.kpeiz_account_engagement_rate).toFixed(3) : 0,
          'Posts' : data[element].data.kpeiz_account_avg_posts_engagement_rate ? +(data[element].data.kpeiz_account_avg_posts_engagement_rate).toFixed(3) : 0
        })

        

      }
    })

    this.dataSource = _rows

    let _data = {
      // 'columns': ['Total', 'Nouveau', 'Admin', 'Fans', 'Réactions', 'Commentaires', 'Partages', 'Total', 'Page', 'Posts'],
      columns: ['pageName', 'Total_des_fans', 'Nouveaux', 'Admin', 'Fans', 'Total_des_interactions', 'Reactions', 'Commentaires', 'Partages', 'Page', 'Posts'],
      rows: _rows
    }

    console.log('rows output', this.dataSource);

    return _data
    
  }
  adjust_number2() {

  }

  adjust_line() {

  }

  refresh () {
    this.widget_data = this.apiService.get(`${this.widget['data_source']}&since=${this.getDate(this.since)}&until=${this.getDate(this.until)}`);
  }
  ngAfterViewInit(){
    // console.log(this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.localName);
    console.log('parents', this.elementRef.nativeElement.parentElement.nodeName);
    setTimeout(()=>{      
      if(this.elementRef.nativeElement.parentElement.nodeName =='app-report-print'){
        this.printComponent = true;
      }
    })
    
  }

  
  chartItemClick(e){
    let date_form = /^(\d{4}-\d{2}-\d{2})$/;

    if(e.active[0]){
      let labelIndex = e.active[0]._index;
      let label = e.active[0]._xScale.ticks[labelIndex];

      if(date_form.test(label)){
        this.dialog.open(PostsComponent,{
          data: [label],
          width: this.singleton.getWindowSize().dialog.x,
          height: this.singleton.getWindowSize().dialog.y
        })
      }
    }

  }


  getDate (d:Date) {
    return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }

  onEditorCreated(event){  
    this.quillCreated.emit(true);
    event.focus()

    
  }

  //#region UI methods => Refactor into directive
  getBgColor(widget) {
    if (widget.value > 0) {
      return "#60B664";
    } else if (widget.value < 0) {
      return "#ED4E4B";
    } else return "white";
  }

 // => Refactor into directive
  getFontColor(widget) {
    return widget.value == 0 ? "grey" : "white";
  }

  // => Refactor into directive
  getArrow(widget, widget_data) {
    if (widget.value > 0) {
      return "../../assets/img/chart-line.svg";
    } else if (widget.value < 0) {
      return "../../assets/img/chart-line-inversed.svg";
    } else return "";
  }
  //#endregion

  //#region callbacks
  adjust_number(data){
    return data = this.format.transform(data);
  }

  spangaps(data){
    console.log('spangaps', data);
    data['values'].forEach(element => {
      element.spanGaps = true;
    });
    return data
    
  }

  adjust_fan_number(data){
    data.formatted = data.kpeiz_fan_count && data.kpeiz_fan_count != null && data.kpeiz_fan_count != 'null' ? this.format.addCommas(data.kpeiz_fan_count) : 'N/A';
    return data;
  }

  adjust_benchmark_fan_number(data){
    data.formatted = data.total_count.kpeiz_fan_count && data.total_count.kpeiz_fan_count != null && data.total_count.kpeiz_fan_count != 'null' ? this.format.addCommas(data.total_count.kpeiz_fan_count) : 'N/A';
    return data;
  }

  adjust_new_fans_number(data){
    data.formatted = data.total_count.kpeiz_fans_variation && data.total_count.kpeiz_fans_variation != null && data.total_count.kpeiz_fans_variation != 'null' ? this.format.addCommas(data.total_count.kpeiz_fans_variation) : 'N/A';
    return data;
  }

  adjust_total(data){
    return data.total_count = data.total_count && data.total_count != null && data.total_count != 'null' ? this.format.transform(data.total_count) : 'N/A';
  }

  adjust_avg(data){
    return data.avgs = data.avgs && data.avgs != null && data.avgs != 'null' ? this.format.transform(data.avgs) : 'N/A';
  }
  
  adjust_avg_post_interactions(data){
    let avg_post_interactions = data.avgs.kpeiz_account_total_interactions && data.total_count.kpeiz_post_count_by_date ? this.format.transform({'key': data.avgs.kpeiz_account_total_interactions / data.total_count.kpeiz_post_count_by_date}) : 'N/A';

    return avg_post_interactions;
  }

  adjust_page_fans_city(data) {
    let rows = data.rows[0].page_fans_city;
    let _rows = [];
    Object.keys(rows).forEach(k => {
      rows[k] = rows[k] == null || rows[k] == 'null' ? 'N/A' : rows[k];
      _rows.push({ "City": k, "Fans Number": +rows[k] })
    });
    console.log('before sorting', _rows);
    _rows = _rows.sort((a,b) => (a['Fans Number'] < b['Fans Number']) ? 1 : ((b['Fans Number'] < a['Fans Number']) ? -1 : 0));
    console.log('after sorting', _rows);

    let obj = { "columns": ["City", "Fans Number"], "rows": _rows };

    return obj;
  }

  adjust_page_fans_country(data) {
    let rows = data.rows[0].page_fans_country;
    let _rows = [];
    Object.keys(rows).forEach(k => {
      _rows.push({ "Country": k, "Fans Number": rows[k] })
    });
    let obj = { "columns": ["Country", "Fans Number"], "rows": _rows }

    return obj;
  }

  adjust_gender_per_age(data) {
    let age_range = [];
    let men = []
    let women = []
    let others = []
    let output: any

    Object.keys(data.values[0].data[0]).forEach(key => {
      if (age_range.indexOf(key.split('.')[1]) === -1)
        age_range.push(key.split('.')[1]);

      let gender = key.split('.')[0];
      switch (gender) {
        case 'F':
          women.push(data.values[0].data[0][key]);
          break;
        case 'M': men.push(data.values[0].data[0][key]);
          break;
        default: others.push(data.values[0].data[0][key]);
          break;
      }

    })

    let values = [
      { label: 'Male', data: men },
      { label: 'Female', data: women },
      { label: 'Others', data: others }
    ]

    output = { 'labels': age_range, 'values': values }

    return output
  }

  adjust_interactions_per_type(data) {
    console.log('interactions by type', data);
    
    let labels = ['Likes', 'Comments', 'Shares'];
    let values = [];

    Object.keys(data.values).forEach(val => {
      //labels.push(data.values[val]['label']);      
      values.push(data.values[val].data[0]);
    })

    // let label = data.values[1].label;
    let output = { 'labels': labels, 'values': [{ 'label': 'value', 'data': values }] };
    // // console.log('interactions', output);

    return output;
    //return data;
  }
  
  display_all_interactions(data) {
    let rows = [];
    let values = [];
    let cols = [];

    Object.keys(data.total_count).forEach(col => {
      let column = col.replace("kpeiz_account_total_", "")
      values.push(data.total_count[col]);
      cols.push(column.charAt(0).toUpperCase() + column.slice(1));
    });
    

    let d=  {
      "values" : [{
        "label": "xxx", 
        "data" : values
      }],
      "labels": cols
    };
    
    return  d;
  }

  adjust_reactions_per_type(data) {

    let labels = [];
    let values = [];
    // console.log(data)
    Object.keys(data.values[0].data[1]).forEach(type => {
      labels.push(type);
      values.push(data.values[0].data[1][type]);
    })

    let label = data.values[1].label;
    let output = { 'labels': labels, 'values': [{ 'label': label, 'data': values }] };
    // console.log('reactions', output);

    return output;
  }

  insertCommas(number: number){
    let n = parseInt(number.toString(), 10).toString();
    if(n.length > 3){
      for(let i = n.length-3; i > 0; i -= 3){
        n = n.slice(0, i) + ',' + n.slice(i);
      }

      // console.log('insertCommas -',this.extractNumber(n),' > 9999 ? -->', this.extractNumber(n) > 9999);
    }
    return n;
  }

  extractNumber(n: string){
    return parseInt(n.match(/\d+/g).map(Number).join(''));
  }

  adjust_engagement_rate(data) {
    //console.log("adjust_engagement_rate", data)
    let page_post_engagements = data.values[0].data;
    let page_fans = data.values[1].data;
    let i = 0;
    let engagement_rate = [];
    page_post_engagements.forEach(element => {
      engagement_rate.push((element / page_fans[i] * 1000).toFixed(2));
      i++;
    });

    data.values = []
    data.values = engagement_rate;
    // console.log("end adjust_engagement_rate", data)
    return data
  }

  adjust_reactions(data) {
    // console.log('reactions:', data);
    
    // let reactions = { "like": 0, "love": 0, "haha": 0, "wow": 0, "sad": 0, "angry": 0 };

    let _data: any;
    Object.keys(data).forEach(account => {
      Object.keys(data[account]).forEach(day => {
        _data.like = data[account][day].page_actions_post_reactions_total.like;
        _data.love = data[account][day].page_actions_post_reactions_total.love;
        _data.haha = data[account][day].page_actions_post_reactions_total.haha;
        _data.wow = data[account][day].page_actions_post_reactions_total.wow;
        _data.sorry = data[account][day].page_actions_post_reactions_total.sorry;
      });
    });

    return _data;
  }

  adjust_interactions_pie_public(data){
    
    let _data = [
          data.total_count.kpeiz_account_total_reactions,
          data.total_count.kpeiz_account_total_comments,
          data.total_count.kpeiz_account_total_shares
        ]

    let output = {
      'labels': ['reactions', 'comments', 'shares'],
      'values': [
        {
          'data': _data,
          'label': 'Interactions'
        }
      ]
    }

    return output;
  }

  //changed the chart type from number to raw to calculate the total!!
  adjust_interactions_by_post_type_pie(data){

    data = Object.values(data)[0];
    let labels = [];
    let i = 0;

    while(Object.keys(Object.values(data)[i]['kpeiz_account_interactions_by_post_type']).length < 7){
      i++
    }

    Object.keys(Object.values(data)[i]['kpeiz_account_interactions_by_post_type']).forEach(post_type => {
      if(post_type !== 'link'){
        labels.push(post_type);
      }
    })
    

    let _data = new Array(labels.length).fill(0);

    Object.keys(data).forEach(date => {
      if(data[date] && data[date].kpeiz_account_interactions_by_post_type){
        let a = data[date].kpeiz_account_interactions_by_post_type;

        Object.keys(a).forEach(post_type => {
        if(post_type !== 'link'){
          _data[labels.indexOf(post_type)] += a[post_type] ? +a[post_type] : 0;
        }
        else
          _data[labels.indexOf('links')] = +_data[labels.indexOf('links')] + a.link ? +a.link : 0;
        })
      }
    })

    let output = {
      'labels': labels,
      'values': [
        {
          'data': _data,
          'label': 'Interactions'
        }
      ]
    }

    return output;
  }

  adjust_fans_by_country(data){

    let labels = [];
    let _data = [];
    let sorted_data = []

    Object.keys(data.page_fans_country).forEach(country => {
      sorted_data.push({country : country, fans : data.page_fans_country[country]})
    })

    sorted_data.sort((a, b) => +a.fans < +b.fans ? 1 : +a.fans > +b.fans ? -1 : 0)

    for( let i = 0; i < 5; i++){
      labels.push(sorted_data[i].country)
      _data.push(sorted_data[i].fans)
    }    

    let output = {
      'labels': labels,
      'values': [
        {
          'data': _data,
          'label': 'ccc',
          'backgroundColor': '#ff6384'
        }
      ]
    }

    console.log('adjust_fans_by_country', output);

    return output;
  }

  adjust_reactions_pie_public(data){
    // console.log('tions_pie', data);
    let like = 0;
    let love = 0;
    let haha = 0;
    let wow = 0;
    let sorry = 0;
    let angry = 0;

    Object.keys(data).forEach(account => {
      Object.keys(data[account]).forEach(date => {
        let a = data[account][date].kpeiz_account_total_reactions_by_type
        if(a){
          like += a.kpeiz_reaction_like ? +a.kpeiz_reaction_like : 0;
          love += a.kpeiz_reaction_love ? +a.kpeiz_reaction_love : 0;
          haha += a.kpeiz_reaction_haha ? +a.kpeiz_reaction_haha : 0;
          wow += a.kpeiz_reaction_wow ? +a.kpeiz_reaction_wow : 0;
          sorry += a.kpeiz_reaction_sorry ? +a.kpeiz_reaction_sorry : 0;
          angry += a.kpeiz_reaction_angry ? +a.kpeiz_reaction_angry : 0;
        }
        
      })
    })

    let _data = [
      like,
      love,
      haha,
      wow,
      sorry,
      angry
    ]


    let output = {
      'labels': ['like', 'love', 'haha', 'wow', 'sorry', 'angry'],
      'values': [
        {
          'data': _data,
          'label': 'Reactions'
        }
      ]
    }

    return output;
  }

  adjust_gender_pie(data){
    let male = 0
    let female = 0
    let other = 0

    Object.keys(data.page_fans_gender_age).forEach(element => {
      
      if(element.startsWith('M'))
        male += data.page_fans_gender_age[element] ? +data.page_fans_gender_age[element] : 0;
      else if(element.startsWith('F'))
        female += data.page_fans_gender_age[element] ? +data.page_fans_gender_age[element] : 0;
      else
        other += data.page_fans_gender_age[element] ? +data.page_fans_gender_age[element] : 0;
    })

    let output = {
      'labels': ['Female', 'Male', 'other'],
      'values': [
        {
          'data': [female, male, other],
          'label': 'Gender'
        }
      ]
    }

    // console.log('gender:',output);

    return output
  }

  adjust_reactions_public(data){
    let _data = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sorry: 0,
      angry: 0
    }

    Object.keys(data).forEach(account => {
      Object.keys(data[account]).forEach(date => {
        let a = data[account][date].kpeiz_account_total_reactions_by_type
        if(a){
          _data.like += a.kpeiz_reaction_like ? +a.kpeiz_reaction_like : 0;
          _data.love += a.kpeiz_reaction_love ? +a.kpeiz_reaction_love : 0;
          _data.haha += a.kpeiz_reaction_haha ? +a.kpeiz_reaction_haha : 0;
          _data.wow += a.kpeiz_reaction_wow ? +a.kpeiz_reaction_wow : 0;
          _data.sorry += a.kpeiz_reaction_sorry ? +a.kpeiz_reaction_sorry : 0;
          _data.angry += a.kpeiz_reaction_angry ? +a.kpeiz_reaction_angry : 0;
        }
      })
    })
    
    _data.like = this.format.addLetter(_data.like);
    _data.love = this.format.addLetter(_data.love);
    _data.haha = this.format.addLetter(_data.haha);
    _data.wow = this.format.addLetter(_data.wow);
    _data.sorry = this.format.addLetter(_data.sorry);
    _data.angry = this.format.addLetter(_data.angry);

    console.log('reactions_data', _data);
    
    return _data;
  }

  adjust_reactions_progression_public(data){
    let like = [];
    let love = [];
    let haha = [];
    let wow = [];
    let sorry = [];
    let angry = [];

    Object.keys(data.values['0'].data).forEach(element => {
      let a = data.values['0'].data
      if(a[element]){
        like.push(a[element].kpeiz_reaction_like ? a[element].kpeiz_reaction_like : 0);
        love.push(a[element].kpeiz_reaction_love ? a[element].kpeiz_reaction_love : 0);
        haha.push(a[element].kpeiz_reaction_haha ? a[element].kpeiz_reaction_haha : 0);
        wow.push(a[element].kpeiz_reaction_wow ? a[element].kpeiz_reaction_wow : 0);
        sorry.push(a[element].kpeiz_reaction_sorry ? a[element].kpeiz_reaction_sorry : 0);
        angry.push(a[element].kpeiz_reaction_angry ? a[element].kpeiz_reaction_angry : 0);
      }
      
    })

    let _data = {
      'labels': data.labels,
      'values': [
        { 'label': 'Like', 'data': like },
        { 'label': 'Love', 'data': love },
        { 'label': 'Haha', 'data': haha },
        { 'label': 'Wow', 'data': wow },
        { 'label': 'Sorry', 'data': sorry },
        { 'label': 'Angry', 'data': angry },
      ]
    }
    
    return _data;
  }

  adjust_interactions_public(data) {

    let _data = {
      interactions: this.format.addLetter(data.total_count.kpeiz_account_total_interactions),
      reactions: this.format.addLetter(data.total_count.kpeiz_account_total_reactions),
      comments: this.format.addLetter(data.total_count.kpeiz_account_total_comments),
      shares: this.format.addLetter(data.total_count.kpeiz_account_total_shares)
    }

    return _data;
  }

  adjust_page_posts_per_type_public(data){
    
    let labels = ['post', 'link', 'status', 'photo', 'video', 'offer', 'event'];
    let post = 0 ;
    let link = 0 ;
    let status = 0 ;
    let photo = 0 ;
    let video = 0 ;
    let offer = 0 ;
    let event = 0 ;
    
    Object.keys(data).forEach(account => {
      Object.keys(data[account]).forEach(date => {
        let a = data[account][date] ? data[account][date].kpeiz_post_count_by_type : undefined
        if(a){
          post += a.post ? +a.post : 0;
          link += a.links ? +a.links : 0;
          status += a.status ? +a.status : 0;
          photo += a.photo ? +a.photo : 0;
          video += a.video ? +a.video : 0;
          offer += a.offer ? +a.offer : 0;
          event += a.event ? +a.event : 0;
        }
        
      })
    })

    let _data = [post, link, status, photo, video, offer, event]

    let output = {
      'labels': labels,
      'values': [
        { 
          'label': 'Posts by type', 
          'data': _data 
        }
      ]
    }
    
    return output;
  }

  adjust_interactions_per_hour_public(data){

    let labels = ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h']

    let _data = new Array(24).fill(0);

    Object.keys(data).forEach(account => {
      Object.keys(data[account]).forEach(date => {
        if(data[account][date].kpeiz_interactions_by_hour && data[account][date].kpeiz_interactions_by_hour.length == 24){
          Object.keys(data[account][date].kpeiz_interactions_by_hour).forEach(hour => {
            _data[hour] += data[account][date].kpeiz_interactions_by_hour[hour] ? +data[account][date].kpeiz_interactions_by_hour[hour] : 0;
          })
        }
        
        
      })
    })

    let output = {
      'labels': labels,
      'values': [
        {
          'data': _data,
          'label': 'Interactions per hour'
        }
      ]
    }

    return output
  }

  adjust_map(data){
    data.chart.caption = '';
    return data
  }

  adjust_heatmap(data){
    data.chart.caption = '';
    console.log('heatmap_data:', data);
    return data;
  }

  adjust_fan_posts_per_type_public(data){

    let labels = ['post', 'link', 'status', 'photo', 'video', 'offer', 'event'];
    let post = 0 ;
    let link = 0 ;
    let status = 0 ;
    let photo = 0 ;
    let video = 0 ;
    let offer = 0 ;
    let event = 0 ;
    
    Object.keys(data).forEach(account => {
      Object.keys(data[account]).forEach(date => {
        let a = data[account][date] ? data[account][date].kpeiz_fan_post_count_by_type : undefined
        if(a){
          post += a.post ? +a.post : 0;
          link += a.links ? +a.links : 0;
          status += a.status ? +a.status : 0;
          photo += a.photo ? +a.photo : 0;
          video += a.video ? +a.video : 0;
          offer += a.offer ? +a.offer : 0;
          event += a.event ? +a.event : 0;
        }
        
      })
    })

    let _data = [post, link, status, photo, video, offer, event]

    let output = {
      'labels': labels,
      'values': [
        { 
          'label': 'Fan posts by type', 
          'data': _data 
        }
      ]
    }
        
    return output;
  }

  adjust_page_fans_online_per_hour(data) {
    console.log('adjust_page_fans_online_per_hour', data);
    

    let labels = ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h']

    let _data = data.values[0].data[0]
    // console.log(_data);

    let output = {
      'labels': labels,
      'values': [
        {
          'data': _data,
          'label': 'Online fans per hour'
        }
      ]
    }

    return output;
  }

  adjust_posts_per_hour(data){
    let labels = ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h']

    console.log('adjust_posts_per_hour', data);

    let _data = new Array(labels.length).fill(0);

    Object.keys(data.values[0].data).forEach(element => {
      Object.keys(data.values[0].data[element]).forEach(value => {
        _data[value] += data.values[0].data[element][value] ? +data.values[0].data[element][value] : 0;
      })
    })


    let output = {
      'labels': labels,
      'values': [
        {
          'data': _data,
          'label': 'Page posts per hour'
        }
      ]
    }
    console.log('adjust_posts_per_hour', output);

    return output;
  }

  adjust_fan_posts_per_type(data){
    
    let labels = []
    let _data = []
    
    Object.keys(data.values[0].data[0]).forEach(element => {
      labels.push(element);
      _data.push(data.values[0].data[0][element]);
    })

    let output = {
      'labels': labels,
      'values': [
        {
          'label': 'Fan posts per type',
          'data': _data
        }
      ]
    }
    console.log('posts_per_type', output);
    return output;
  }
    
  adjust_posts_public(data){
    
    delete data['total_count'];
    delete data['avgs'];
    let posts = data['posts'];
    //let account_id = Object.values(posts)[0]['account_id'];

    let _data = []; 

    //Object.keys(data).forEach(pageID => {
      Object.keys(posts).forEach(postID => {  
        
        if(!this.singleton.postsPages[posts[postID]['account_id']]){
          this.fbService.getFbPage(posts[postID]['account_id']).subscribe(p => {
            p.then(result => {
              this.singleton.postsPages[posts[postID]['account_id']] = {
                id: posts[postID]['account_id'], 
                name: result['name'], 
                link: result['link'], 
                picture: result['picture']['data']['url']};
            })
          })
        }
        this.postsPages = this.singleton.postsPages;
        
        posts[postID].post_link = 'https://facebook.com/'+posts[postID].account_id+'_'+postID;
        posts[postID].page_picture = posts[postID].page_picture ? posts[postID].page_picture : 'https://scontent.fnbe1-1.fna.fbcdn.net/v/t1.0-1/c81.0.275.275/399548_10149999285987789_1102888142_n.png?_nc_cat=1&_nc_ht=scontent.fnbe1-1.fna&oh=4e4f88c4151c253a442eefe2696b092d&oe=5C7E3FA0'
        posts[postID].pageName = this.pageName ? this.pageName : posts[postID].account_id;
        posts[postID].like = posts[postID].kpeiz_reaction_like ? posts[postID].kpeiz_reaction_like : 0;
        posts[postID].love = posts[postID].kpeiz_reaction_love ? posts[postID].kpeiz_reaction_love : 0;
        posts[postID].haha = posts[postID].kpeiz_reaction_haha ? posts[postID].kpeiz_reaction_haha : 0;
        posts[postID].wow = posts[postID].kpeiz_reaction_wow ? posts[postID].kpeiz_reaction_wow : 0;
        posts[postID].sorry = posts[postID].kpeiz_reaction_sorry ? posts[postID].kpeiz_reaction_sorry : 0;
        posts[postID].angry = posts[postID].kpeiz_reaction_angry ? posts[postID].kpeiz_reaction_angry : 0;
        posts[postID].reactions = posts[postID].kpeiz_post_total_reactions ? posts[postID].kpeiz_post_total_reactions : 0;
        posts[postID].interactions = posts[postID].kpeiz_post_total_interactions ? posts[postID].kpeiz_post_total_interactions : 0;
        posts[postID].post_activity_unique = posts[postID].post_activity_unique ? posts[postID].post_activity_unique : 0;
        posts[postID].post_impressions_unique = posts[postID].post_impressions_unique ? posts[postID].post_impressions_unique : 0;
        
        // post virality = PTAT / reach * 1000 
        posts[postID].virality = posts[postID].post_impressions_unique != 0 ? (posts[postID].post_activity_unique / posts[postID].post_impressions_unique * 1000).toFixed(2) : 0;

        posts[postID].kpeiz_post_engagment_rate = posts[postID].kpeiz_post_engagment_rate ? (+posts[postID].kpeiz_post_engagment_rate).toFixed(2) : 0;
        posts[postID].isPublic = posts[postID].post_impressions_paid_unique ? false : true;

        _data.push(posts[postID]);

        let post = {};
        post[postID] = posts[postID];
        this.singleton.posts[posts[postID]['published_date']] ? 
        this.singleton.posts[posts[postID]['published_date']].push(post) : 
        this.singleton.posts[posts[postID]['published_date']] = [post];

      });
    //})


    return _data;
  }
  
  adjust_benchmarks_table(data){
    
    let _rows = [];
    
    Object.keys(data).forEach(element => {
      if (element != "total_count" && element != "avgs") {
        
        let el = data[element];

        _rows.push({
          'id': element,
          'picture' : el.picture ? el.picture : 'https://scontent.fnbe1-1.fna.fbcdn.net/v/t1.0-1/c81.0.275.275/399548_10149999285987789_1102888142_n.png?_nc_cat=1&_nc_ht=scontent.fnbe1-1.fna&oh=4e4f88c4151c253a442eefe2696b092d&oe=5C7E3FA0',
          'pageName' : this.getPageName(element),
          'Total_des_fans' : el.fans ? +el.fans : 0,
          'Nouveaux' : el.fans_variation ? +el.fans_variation : 0,
          'Admin' : el.page_posts ? +el.page_posts : 0,
          'Fans' : el.fans_posts ? +el.fans_posts : 0,
          'Reactions' : el.reactions ? +el.reactions : 0,
          'Commentaires' : el.comments ? +el.comments : 0,
          'Partages' : el.shares ? +el.shares : 0,
          'Total_des_interactions' : el.interactions ? +el.interactions : 0,
          'Page' : el.avg_page ? +(el.avg_page).toFixed(3) : 0,
          'Posts' : el.avg_post ? +(el.avg_post).toFixed(3) : 0
        })

        this.fbService.getFbPage(element).subscribe(p => {
          p.then(result => {
            this.benchmarkPages[element] = {
              id: element, 
              name: result['name'], 
              link: result['link'], 
              picture: result['picture']['data']['url']};
          })
        })

      }
    })

    this.dataSource = _rows

    let _data = {
      // 'columns': ['Total', 'Nouveau', 'Admin', 'Fans', 'Réactions', 'Commentaires', 'Partages', 'Total', 'Page', 'Posts'],
      columns: ['pageName', 'Total_des_fans', 'Nouveaux', 'Admin', 'Fans', 'Total_des_interactions', 'Reactions', 'Commentaires', 'Partages', 'Page', 'Posts'],
      rows: _rows
    }

    console.log('rows output', this.dataSource);

    return _data
  }

  sortData(sort: Sort) {
    //const data = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      //this.dataSource = data;
      return;
    }
    // ['pageName', 'Total_des_fans', 'Nouveaux', 'Admin', 'Fans', 'Total_des_interactions', 'Reactions', 'Commentaires', 'Partages', 'Page', 'Posts'],
    this.dataSource = this.dataSource.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'pageName': return this.compare(a.pageName, b.pageName, isAsc);
        case 'Total_des_fans': return this.compare(a.Total_des_fans, b.Total_des_fans, isAsc);
        case 'Nouveaux': return this.compare(a.Nouveaux, b.Nouveaux, isAsc);
        case 'Admin': return this.compare(a.Admin, b.Admin, isAsc);
        case 'Fans': return this.compare(a.Fans, b.Fans, isAsc);
        case 'Total_des_interactions': return this.compare(a.Total_des_interactions, b.Total_des_interactions, isAsc);
        case 'Reactions': return this.compare(a.Reactions, b.Reactions, isAsc);
        case 'Commentaires': return this.compare(a.Commentaires, b.Commentaires, isAsc);
        case 'Partages': return this.compare(a.Partages, b.Partages, isAsc);
        case 'Page': return this.compare(a.Page, b.Page, isAsc);
        case 'Posts': return this.compare(a.Posts, b.Posts, isAsc);
        default: return 0;
      }
    });
    console.log('sorted data source:',this.dataSource);
    
  }

  // => Refactor into directive/pipe
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  adjust_benchmark_fans_progression(data){
    data.labels.forEach((element, i=0) => {
      data.labels[data.labels.indexOf(element)] = this.getPageName(data.labels[data.labels.indexOf(element)]);
    });
    return data
  }

  adjust_benchmark_fans_variation(data){
    data.values.forEach(element => {
      element.label = this.getPageName(element.label);
    });
    return data
  }

  adjust_benchmark_interactions_by_page(data){
    data.labels.forEach(element => {
      data.labels[data.labels.indexOf(element)] = this.getPageName(data.labels[data.labels.indexOf(element)]);
    });
    return data;
  }
  
  adjust_benchmark_er_by_page(data){
    console.log('adjust_benchmark_er_by_page', data);

    data.labels.forEach(element => {
      console.log('adjust_benchmark_er_by_page element', element);
      data.labels[data.labels.indexOf(element)] = this.getPageName(data.labels[data.labels.indexOf(element)]);
    });
    console.log('adjust_benchmark_er_by_page', data);

    return data;
  }
 
  getPageName(pageID){
    //console.log('recieved page id:', pageID);
    let pageName;
    console.log('this.social_accounts', this.social_accounts);
    
    if(this.social_accounts){
      pageName = this.social_accounts.find(x => x['remote_id'] === pageID+'');
      console.log('this.social_accounts pagename', pageName);

      if(pageName)
        pageName = pageName['title'];
    }
    return pageName? pageName : pageID;
  }  



  show(page,wref){
    
    
     this.areaClicked.next(
       {
       "page": page,
        "wref": wref
      }
       );
       console.log("show ", page, wref);
    //console.log("areaClicked", this.areaClicked);
  }
  
}
