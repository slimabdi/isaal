import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit {

  features = ['Moderation', 'Productivity'];
  featuresUrls = ['moderation', 'productivity']; 

  constructor() { }

  ngOnInit() {
  }

}
