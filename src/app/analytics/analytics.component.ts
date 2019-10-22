import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {

  @Input() opened;
  
  tool = "analytics";
  constructor() { }

  ngOnInit() {
  }

}
