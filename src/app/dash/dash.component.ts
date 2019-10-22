import { CreateReportComponent } from './../create-report/create-report.component';

import { ApiService } from "./../api.service";
import { Component, OnInit, AfterViewInit, Input, HostListener, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';


import { MatSnackBar, MatTabChangeEvent } from "@angular/material";
import { DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { MatDialog } from "@angular/material";
import { DashboardSuccessComponent } from '../dashboard-success/dashboard-success.component';
import { SingletonService } from '../singleton.service';

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"],
  
})
//test
export class DashComponent implements OnInit, AfterViewInit, OnDestroy {

  //#region variables
  @Input('pageID') pageID;

  dashboardID: string;

  

  dataSubscription: Subscription;
  posts: any[] = [];
  post_count = 0;
  page_data: any;
  post_data: any;

  since: Date;
  until: Date;

  options: GridsterConfig;
  
  range:Range = { fromDate : new Date(), toDate : new Date()} ;
  datePickerOptions:NgxDrpOptions;
  presets:Array<PresetItem> = [];
  
  lottieConfig;
  layoutSaved = true;
  currentLayout = [];
  objectKeys = Object.keys;
  dashboard;

  // widget_pos_size = {
  //     'average_page_engagement' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fan_number' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'new_fans' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'page_posts' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fans_posts_count' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'impressions' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'engaged_users' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'avg_post_engagement' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_number' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'all_interactions' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'worldmap' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fans_progression' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'page_posts_bar' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'engagement_rate_variation' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_progress' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },

  //     'fan_number': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'likes_count_progression': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'gender_age': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fans_region': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'worldmap': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fans_by_country': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fans_online': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'online_fans_per_hour' : { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_by_type': { 
  //       "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //       "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //       "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //       "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //       "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //       "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //       "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //     },
  //      // line: Reactions, Shares and Comments
  //     'reactions_pie': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       }, // pie: Like, Love, Haha....
  //     'reactions_x': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       }, // line: reactions
  //     'engagement_rate_variation': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'avg_posts_engagement_rate': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_progress': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'post_activity_unique': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       }, // PTAT !!!
  //     'virality_rate': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'avg_engagement_on_reach': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       }, // moyenne du taux d'implication des utilisateurs atteints
  //     'engagement_on_reach': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },  // taux d'implication des utilisateurs atteints,
  //     'implication': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       }, // taux d'implcation des fans
  //     'negative_feedback': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'paid_and_organic_impressions': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       }, // nombre d'impressions payées et organiques des publications

  //     'page_posts_bar': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'page_posts_by_type': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fans_posts_count_evolution': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'fan_posts_by_type': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_by_day': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_by_post_type': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'interactions_by_hour': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  //     'posts': { 
  //         "SCREEN_4K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_2K" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_FULL_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_HD" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_MEDIUM" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_TABLET" : {"x":"", "y":"", "cols":"", "rows":""},
  //         "SCREEN_PHONE" : {"x":"", "y":"", "cols":"", "rows":""},
  //       },
  // }

  ws_widgets = [];
  rendered_widgets=[];
  current_widgets = {};

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MatDialog,
    public snackBar : MatSnackBar,
    private router: Router,
    private singleton: SingletonService
  ) {
    this.lottieConfig = {
      path: 'assets/img/kpeiz_loading_logo.json',
      renderer: 'svg',
      autoplay: true,
      loop: true
    };
  }
  //#endregion
cons(o) {

  Object.keys(o).forEach(elem => {
    console.log("cons", elem, o[elem])
  }) 
}

  //#region Main program
  ngAfterViewInit() {
    


      //get dashboard id from URL
      this.route.params.subscribe(
        (params: Params) => {
          this.dashboardID = params['dashboardID'];
        }
      )
      

      this.apiService.asyncGet(`dashboards/${this.dashboardID}`).subscribe(p => {
        p.then((data: any) => {
            
          //if dashboard data is not ready (should display appropriate message)
          //else set this.widgets
          if(data.status==401){
            ;
          }else {
            this.dashboard =  data.data;
            this.current_widgets = this.dashboard.widgets.overview;
            this.layoutSaved = true;
          } 
        })
      })
      
      
  }

  //#region UI methods
  ngOnInit() {

    //if there is an existing date range in the local storage, set it, otherwise create a new date range
    let localDateRange = JSON.parse(window.localStorage.getItem('dashboardDateRange'));
    console.log('dashboardDateRange',localDateRange);
    if(localDateRange){
      this.since = new Date(localDateRange.since);
      this.until = new Date(localDateRange.until);
    }
    else{
      let t = new Date();
      this.until = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1);
      this.since = new Date(this.until.getFullYear(), this.until.getMonth(), this.until.getDate() - 14); 
    }

    console.log("Since", this.since);
    console.log("Until", this.until);
    
    this.range= {fromDate:this.since, toDate: this.until };

    // Gridster Options
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.None,
      pushItems: true,
      swap: true,
      margin: 20,
      mobileBreakpoint: 768,
      maxCols: 10,
      minCols: 10,
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
                    //toMinMax: {fromDate: toMin, toDate: new Date()},
                    calendarOverlayConfig: {
                      shouldCloseOnBackdropClick: true,
                    }
                  };    

    // this.apiService.get('auth/me').subscribe(res => {
    //   this.authorized = res.role_id == 0 ? true : false;
    // })
    

  }

  onTabChanged(event: MatTabChangeEvent) {
    console.log('tab => ', event.tab.textLabel, this.dashboard.widgets[event.tab.textLabel.toLowerCase()]);
    this.current_widgets = this.dashboard.widgets[event.tab.textLabel.toLowerCase()]
    //this.setGridOptions(10);
    //this.options.api.optionsChanged();
  }


  ngOnDestroy(){
    this.singleton.reset();
  }

  itemChange(item) {
  }

  itemResize(item) {
    console.log(item," item resized");
    // this.rendered_widgets.push(item);

    // console.log(this.rendered_widgets.length, this.widgets.length);
    
    // if(this.rendered_widgets.length == this.widgets.length) {
    //   //enable save layout button

    // }

  }

  changedOptions() {
    setTimeout(() => {
      this.options.api.optionsChanged();
    }, 700);
  }

  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    //this.dashboard.push({});
  }
  //#endregion

  saveLayout() {
    this.currentLayout = [];
    this.dashboard.forEach(widg => {
      this.currentLayout.push({ 'id': widg.data.id, 'cols': widg.cols, 'rows': widg.rows, 'x': widg.x, 'y': widg.y });
    })

    this.apiService.put('updateLayout', { 'widgets': this.currentLayout }).subscribe(res => {
      //toast.. layout updated and saved!
      this.snackBar.open('layout updated and saved!', '✔', { duration: 2000 });
      this.layoutSaved = true;
    })
  }

  saveLayoutForScreen() {
    let layout = [];
    this.dashboard.forEach(widg => {
      layout.push({ 'uid': widg.uid, 'cols': widg.cols, 'rows': widg.rows, 'x': widg.x, 'y': widg.y });
    })

    
  }

  saveLayoutConfig(screen, layout){
    console.log("saving layout to layout_config_"+screen+".json with config:",layout);
    //let fs = require("fs");
    // fs.writeFile("./layout_config_"+screen+".json", JSON.stringify(layout, null, 4), (err) => {
    //   if (err) {
    //       console.error(err);
    //       return;
    //   };
    //   console.log("layout_config_"+screen+".json has been created!");
    // });
  }

  generateReport(){
      this.dialog.open(CreateReportComponent, {
        data:  [this.dashboardID, this.since, this.until],
        width: '600px',
        height: '400px',
        autoFocus: false
      })
  }
  
  updateRange(range: Range){
    this.since = range.fromDate;
    this.until = range.toDate;

    window.localStorage.setItem('dashboardDateRange', JSON.stringify( 
      {'since': this.since, 'until': this.until} 
    ));
    
    //refresh the posts list
    this.singleton.posts = {}
  } 

  // helper function to create initial presets fro daterang picker
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    //just to remind
    // SCREEN_4K = 3800
    // SCREEN_2K = 2500
    // SCREEN_FULL_HD = 1900
    // SCREEN_HD = 1200
    // SCREEN_MEDIUM = 760
    // SCREEN_TABLET = 570
    // SCREEN_PHONE = 320
    
    if(event.target.innerWidth >= this.singleton.SCREEN_FULL_HD)
    {
      this.setGridOptions(10)
      this.setGridItems(this.singleton.SCREEN_FULL_HD)
    }
    else if(event.target.innerWidth < this.singleton.SCREEN_FULL_HD && event.target.innerWidth >= this.singleton.SCREEN_HD)
      {
        this.setGridOptions(10)
        this.setGridItems(this.singleton.SCREEN_HD)
      }
    else if(event.target.innerWidth < this.singleton.SCREEN_HD && event.target.innerWidth >= this.singleton.SCREEN_TABLET)
      {
        this.setGridOptions(4)
        this.setGridItems(this.singleton.SCREEN_TABLET)
      }
    else if(event.target.innerWidth < this.singleton.SCREEN_TABLET && event.target.innerWidth >= this.singleton.SCREEN_PHONE)
      {
        this.setGridOptions(2)
        this.setGridItems(this.singleton.SCREEN_PHONE)
      }
      
  }

  setGridItems(screen_width){

    this.dashboard.forEach(widget => {

      //#region responsive widgets
      
      switch(widget.uid){
        case 'all_interactions':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'average_page_engagement':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'avg_engagement_on_reach':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'avg_post_engagement':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'avg_posts_engagement_rate':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'avg_rate_of_reached_users':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'engaged_users':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'engagement_on_reach':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'engagement_rate_variation':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fan_number':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
              case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fan_posts_by_type':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fans_by_country':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fans_online':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fans_posts_count':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fans_posts_count_evolution':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fans_progression':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'fans_region':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'gender_age':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'gender_pie':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'implication':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'impressions':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'interactions_by_day':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'interactions_by_hour':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'interactions_by_post_type':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'interactions_by_type':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'interactions_number':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'likes_count_progression':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'negative_feedback':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'new_fans':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'online_fans_per_hour':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'page_fans':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'page_impressions':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'page_posts':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'page_posts_bar':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'page_posts_by_type':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'paid_and_organic_impressions':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'paid_and_organic_reach':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'posts':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'posts_by_day':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'posts_by_hour':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'reactions':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'reactions_pie':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'reactions_x':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'virality_rate':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        case 'worldmap':
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
        default:
          switch(screen_width){
            case this.singleton.SCREEN_FULL_HD:
              break;
            case this.singleton.SCREEN_HD:
              break;
            case this.singleton.SCREEN_TABLET:
              break;
            case this.singleton.SCREEN_PHONE:
              break;
            default:
              break;
          }
          break;
      }
      
     //#endregion
    });
  }

  gridsterInitialized(o) {
    console.log("gridsterInitialized", o);
    
  }

  setGridOptions(cols){
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.None,
      pushItems: true,
      swap: true,
      margin: 20,
      mobileBreakpoint: 1,
      maxCols: cols,
      minCols: cols,
      minRows: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      initCallback : this.gridsterInitialized.bind(this) ,
      itemChangeCallback: this.itemChange.bind(this),
      itemResizeCallback: this.itemResize.bind(this),
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'd-handle',
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

    //this.changedOptions();

  }

  resizingStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
    if(item!=itemComponent.$item) this.layoutSaved = false;
    /*let old_item_x: number = item.x
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
     */


  }
  
}