import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Inject } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatPaginator, MatTableDataSource, MatSort, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit, AfterViewInit {
  
  reports;
  constructor(private apiService: ApiService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private dialogref: MatDialogRef<ReportListComponent> = null,
    @Inject(MAT_DIALOG_DATA) public data = null
    ) { }

  displayedColumns: string[] = ['name', 'start_date', 'end_date', 'edit'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  related_dashboard;

  ngOnInit() {
    console.log('dialogref', this.dialogref);
    
    // console.log('chosen dashboard:', this.data.id);
    
     this.apiService.get('reports').subscribe(res=>{
       if(this.data){
        this.related_dashboard = this.data.name;
        this.dataSource.data = res.reports && this.data.id ? res.reports.filter(x => x.dashboard_id == this.data.id) : res.reports;
       } else {
        this.dataSource.data = res.reports
       }
       this.dataSource.data = this.dataSource.data.length > 0 ? this.dataSource.data : null;
       console.log('reports_data', this.dataSource);
       
     })
  }
  
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewReport(row){
    console.log('this.route', this.route);
    this.dialogref.close(row.id);
    // this.router.navigate(['app/analytics/reports/', row.id]);
  }

  editReport(element: {}){
    console.log(element);
    
  }
}
