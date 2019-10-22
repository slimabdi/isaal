import { FacebookService } from './../facebook.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ApiService } from './../api.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { MatSort, MatTableDataSource, MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-benchmarks',
  templateUrl: './benchmarks-create.component.html',
  styleUrls: ['./benchmarks-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BenchmarksCreateComponent implements OnInit {

  p: number = 1; 
  benchmarks: any[];  

  benchTypes = [
    {name: 'Regional Benchmark', type: 'regional-benchmark'},
    {name: 'Sectorial Benchmark', type: 'sectorial-benchmark'}
  ];

  tags: Observable<any>;

  pagesForm: FormGroup;
  benchmarkForm: FormGroup;

  benchmarkName = new FormControl();

  filteredBenchmarks: Observable<any>;

  constructor(private apiService: ApiService,
              public submitSnack: MatSnackBar,
              private dialogRef:MatDialogRef<BenchmarksCreateComponent>,
              private fbService: FacebookService
              ) { 
    this.pagesForm = new FormGroup({
      'bechmark_title': new FormControl('', Validators.required),
      'pages' : new FormArray([
          new FormControl('', [Validators.required])
          ])
    }, Validators.required);

    this.benchmarkForm = new FormGroup({
      'bechmark': new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    
    this.apiService.get('benchmarks/all').subscribe((res: any) => {   
      this.benchmarks = res.data.benchmarks;
      this.filteredBenchmarks = this.benchmarkName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
    })

    this.tags = this.apiService.get('tags');
  }

  // Dynimacally add pages to input of pages
  onAddPage(){
    const control = new FormControl('', Validators.required);
    (<FormArray>this.pagesForm.get('pages')).push(control);
  }


// ADDD or CREATE Benchmark
   onAddCustom(){

    let urls =[];
    
    ((<FormArray>this.pagesForm.get('pages')).controls).forEach(control => {
      urls.push(control.value);
    })

    let pageNames:string[] = [];
    urls.forEach(el => {
      let url = el.split('/');
      if(url[url.length -1 ]=== ""){
        pageNames.push(url[url.length - 2]);
      }else {
        pageNames.push(url[url.length - 1]);
      }
    });

    
    let pages = [];

     pageNames.forEach(pageName => {
       this.fbService.getFbPage(pageName).subscribe(p => {
         p.then((res:any) => {
           let page= {
                    "remote_id": res.id,
                    "provider": "Facebook",
                    "url":`http://facebook.com/${pageName}`,
                    "title": res.name,
                    "nickname" : pageName,
                    "description":res.about,
                    "cover" : res.picture.data.url,
           }

           if(res['access_token'])
              page['access_token'] = res.access_token;
          pages.push(page)
         }).then(()=> {
          if(pages.length>=2){
              let pagesLoad = {
              "name": this.pagesForm.get('bechmark_title').value,
              "pages": pages,
              }
              console.log("REST pageload", pagesLoad);


              this.apiService.post('benchmarks/add',pagesLoad).subscribe((res:any) => {

                console.log(res);               

                if(res.errors==0){

                  this.pagesForm.get('bechmark_title').reset();
                  this.pagesForm.get('bechmark_title').setErrors(null);
                  (<FormArray>this.pagesForm.get('pages')).controls.forEach(c=>{
                    c.reset();
                    c.setErrors(null);
                  });
                  
                  this.submitSnack.open('Benchmark successfully added', '', {duration : 2000} )
                }
              })
          }
         })
       })
    })
  }


  onAddExistBenchmark(){
    // let benchID = this.benchmarkForm.get('bechmark').value;

    let requestedBench = this.benchmarks.find(benchmark => benchmark.id==this.benchmarkForm.get('bechmark').value);

    console.log(requestedBench);

    let benchmarkLoad = {
      "benchmark_id": requestedBench.id
    }

    this.apiService.post('benchmarks/add', benchmarkLoad).subscribe((res:any) => {
      if(res.errors==0){
        setTimeout(()=>this.dialogRef.close(true), 1000)
      }
    })
    
  }

  private _filter(value: string){
    const filterValue = value.toLowerCase();
    
    return this.benchmarks.filter(benchmark => benchmark.name.toLocaleLowerCase().includes(filterValue)); 
  }

  

}
