import { ApiService } from './../api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'adsmanager',
  templateUrl: './ads-manager.component.html',
  styleUrls: ['./ads-manager.component.scss']
})
export class AdsManagerComponent implements OnInit, OnDestroy {

  pageId;
  page;
constructor(private apiService: ApiService) { }

  ngOnInit() {  
    // this.apiService.initSocket();
    // this.apiService.onMessage().subscribe(msg => {
    //   console.log("Message recieved form soekt",msg)
    // })

  }

    // test(){
    //   console.log('clicked');
      
    //   this.apiService.sendToSocket();
    // }

  ngOnDestroy() {
  }

}
