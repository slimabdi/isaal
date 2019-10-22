import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-success',
  templateUrl: './dashboard-success.component.html',
  styleUrls: ['./dashboard-success.component.scss']
})
export class DashboardSuccessComponent implements OnInit {

  lottieConfig;

  constructor() {
    this.lottieConfig = {
      path: '../../assets/img/kpeiz_loading_logo.json',
      renderer: 'svg',
      autoplay: true,
      loop: true
    };
   }

  ngOnInit() {
  }

}
