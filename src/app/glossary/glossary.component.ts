import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  primary = "#4B85E6";
  step = 0;
  displayedColumns: string[] = ['name', 'definition'];
  definitions = [
    {name: 'Impressions', definition: 'Total visualization number of the page and its posts.'},
    {name: 'Reach', definition: 'Number of unique people that a post can reach.'},
    {name: 'Total reach', definition: 'Number of people who have viewed a content (eg: posts displayed on their Facbook wall) associated to your page within the selected period.'},
    {name: 'Engaged users', definition: 'Exact number of people who have clicked on a post (comment, share, click on a photo, pause video..).'},
    {name: 'Reached users', definition: 'Number of reached people with the page posts.'},
    {name: 'People Talking About That (PTAT)', definition: 'People that created a topic from your Facebook page through a post that they liked, commented or shared.'},
    {name: 'Comments', definition: 'Fans comments and sub-comments + Page administrators comments and responses.'}
  ];
  formulas = [
    {name: 'Virality Rate', definition: '(People talking about it / Reach) X 100(People Talking About This/Reached users) X 100'},
    {name: 'Engagement rate objective', definition: '(Number of interactions / Reach) X 100'},
    {name: 'Negative Feedback rate', definition: '( Negative Feedback / Reach) X 100'},
    {name: 'Users engagement rate', definition: '( Engaged users / Total number of fans) X 100'},
    {name: 'Engagement rate of reached users', definition: '(Engaged users/ Users reached ) X 100'},
    {name: 'CTR (Click - Through Rate)', definition: '(Number of clicks/ Reach) X100'},
    {name: 'Page engagement rate ', definition: '(Number of post interactions/ Number of fans) X 100'},
    {name: 'Average post engagement rate', definition: 'Engagement rate / Number of posts'},
  ];

  constructor() { }

  ngOnInit() {
  }

  setStep(index: number) {
    this.step = index;
  }

}
