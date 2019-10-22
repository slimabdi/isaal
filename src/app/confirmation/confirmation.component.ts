import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    console.log(this.data.toDelete);
    
  }

}
