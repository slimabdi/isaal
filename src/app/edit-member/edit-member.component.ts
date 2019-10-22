import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent implements OnInit {

  @ViewChild('f') f: NgForm;

  memberForm:NgForm;
  memberPages: any[];
  ownerPages: any[];
  action: string;

  remotIds : any[] = [];

  constructor() {

  }

  ngOnInit() {    

  
  }
}
