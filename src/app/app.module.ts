import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';
import { BenchmarkListComponent } from './benchmark-list/benchmark-list.component';
import { BenchmarkViewComponent } from './benchmark-view/benchmark-view.component';
import { Config } from './config';
import { PacksComponent } from './packs/packs.component';
import { AuthentificationGuardService } from './auth/authentification-guard.service';
import { AuthModule } from './auth/auth.module';
import { NgModule ,NO_ERRORS_SCHEMA} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { SnLoginComponent } from './sn-login/sn-login.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ModerationComponent } from './moderation/moderation.component';
import { MyDashboardsComponent } from './my-dashboards/my-dashboards.component';
import { PostPlanComponent } from './post-plan/post-plan.component';
import { MyCompetitionsComponent } from './my-competitions/my-competitions.component';
import { AdsManagerComponent } from './ads-manager/ads-manager.component';
import { CustomeDashboardsComponent } from './custome-dashboards/custome-dashboards.component';
import { DashComponent } from './dash/dash.component';
import { CompetitionComponent } from './competition/competition.component';
import { UserPagesComponent } from './user-pages/user-pages.component';
import { TeamManagementComponent } from './team-management/team-management.component';

import { ChartsModule } from 'ng2-charts';
import { LayoutModule } from '@angular/cdk/layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WidgetComponent } from './widget/widget.component';

import { GridsterModule } from 'angular-gridster2';
import { BenchmarksCreateComponent } from './benchmarks-create/benchmarks-create.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { ReportViewComponent } from './report-view/report-view.component';

import { Ng2TelInputModule } from 'ng2-tel-input';

import { ReportListComponent } from './report-list/report-list.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { DashboardSuccessComponent } from './dashboard-success/dashboard-success.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlossaryComponent } from './glossary/glossary.component';
import {Configuration} from './configuration'
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { FormatPipe } from './pipes/format.pipe';
import { PostsComponent } from './posts/posts.component';

import { LottieAnimationViewModule } from 'ng-lottie';

import * as FusionCharts from 'fusioncharts';
import * as powercharts from 'fusioncharts/fusioncharts.powercharts';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionMaps from 'fusioncharts/fusioncharts.maps';
import * as World from 'fusioncharts/maps/fusioncharts.world';
import * as WorldWithCountries from 'fusioncharts/maps/fusioncharts.worldwithcountries';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { ReportGridDirective } from './report-grid.directive';
import { ReportPrintComponent } from './report-print/report-print.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslatePipe } from './translate.pipe';
import {TranslateService} from './translate.service';
import { HostlistinerDirective } from './hostlistiner.directive';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import * as HeatMap from 'fusioncharts/viz/heatmap';
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionMaps, World, WorldWithCountries, FusionTheme, powercharts);

// import { CanvasJS } from 'canvasjs';


// import { HintModule } from 'angular-custom-tour'



const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SnLoginComponent },
  {
    path: 'app', component: HomeComponent, canActivate: [AuthentificationGuardService], children: [
      {
        path: 'analytics', component: AnalyticsComponent, children: [
          { path: 'home', component: AnalyticsHomeComponent },

          { path: 'dashboards', component: MyDashboardsComponent },
          { path: 'dashboards/:dashboardID', component: DashComponent },
          { path: 'dashboards/:dashboardID/:dashboardName', component: DashComponent },

          { path: 'benchmarks', component: BenchmarkListComponent },
          { path: 'benchmarks/:benchmarkID', component: BenchmarkViewComponent },
          { path: 'benchmarks/:benchmarkID/:benchmarkName', component: BenchmarkViewComponent },
          
          { path: 'reports', component: ReportListComponent },
          { path: 'reports/:reportID', component: ReportViewComponent },
        ]
      },
      {
        path: 'postplan', component: PostPlanComponent, children: [
          { path: 'calendars', component: MyDashboardsComponent },
          { path: 'inspire', component: MyDashboardsComponent },
          { path: 'plan-post', component: MyDashboardsComponent },
          { path: 'optimize', component: MyDashboardsComponent },
        ]

      },
      {
        path: 'moderation', component: ModerationComponent, children: [
          { path: 'moderate', component: MyDashboardsComponent },
          { path: 'productivity', component: MyDashboardsComponent },
        ]
      },
      { path: 'adsmanager', component: AdsManagerComponent },
      // { path: 'manage', component: TeamManagementComponent },
      { path: 'packs', component: PacksComponent },
    ]
  },
  {path: 'print-report/:reportID/:token', component: ReportPrintComponent} //for printing

]

@NgModule({
  declarations: [
    AppComponent,
    SnLoginComponent,
    UserPagesComponent,
    MainNavComponent,
    HomeComponent,
    NavTabsComponent,
    AnalyticsComponent,
    MyDashboardsComponent,
    MyCompetitionsComponent,
    ModerationComponent,
    AdsManagerComponent,
    PostPlanComponent,
    CompetitionComponent,
    CustomeDashboardsComponent,
    DashComponent,
    TeamManagementComponent,
    PacksComponent,
    BenchmarksCreateComponent,
    EditMemberComponent,
    WidgetComponent,
    BenchmarkListComponent,
    BenchmarkViewComponent,
    ReportViewComponent,
    AnalyticsHomeComponent,
    ReportListComponent,
    CreateReportComponent,
    UserProfileComponent,
    DashboardSuccessComponent,
    GlossaryComponent,
    BenchmarksCreateComponent,
    FormatPipe,
    ReportGridDirective,
    ReportPrintComponent,
    ConfirmationComponent,
    PostsComponent,
    TranslatePipe,
    HostlistinerDirective,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
    AuthModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    AuthModule,
    ChartsModule,
    QuillModule,
    GridsterModule,
    NgxMatDrpModule,
    Ng2TelInputModule,
    MaterialDesignModule,
    TranslateModule.forRoot({loader: {   provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}}),
    LottieAnimationViewModule.forRoot(),
    FusionChartsModule,
    // ReportListComponent
    // CanvasJS
    NgxPaginationModule
  ],
  providers: [
    {provide: MatDialogRef, useValue: {}},
    { provide: MAT_DIALOG_DATA, useValue: [] },
    Config,
    FormatPipe,
    TranslateService,
    Configuration
  ],
  entryComponents: [
    BenchmarksCreateComponent, 
    CreateReportComponent, 
    UserPagesComponent, 
    UserProfileComponent, 
    DashboardSuccessComponent,
    PostsComponent,
    GlossaryComponent,
    ConfirmationComponent,
    TeamManagementComponent,
    ReportListComponent 
  ],

  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
