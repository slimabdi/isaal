import { ConfirmationComponent } from './../confirmation/confirmation.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { EditMemberComponent } from './../edit-member/edit-member.component';
import { Subscription, from } from 'rxjs';
import { ApiService } from './../api.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TeamService}  from './team.service';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';



@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit, OnDestroy {

  idteam :any ;
  teamForm: FormGroup;
  memberPages: any[];
  pages: any[];
  email:any;
  iditenfiantmembre : any;
  dashboardIds : any[] = [];
  teamEmails: any[] = [];
  buttonType: string = 'Invite';
  member: any;
  name: string = '';
  Teamgroupe : any = [];
  teamSubscripttion: Subscription;
  pageSubscription: Subscription;

  team = [];
  // loead team 
  stateGroupOptions: Observable<any[]>;
  //MatcheckBoxes form
  @ViewChild('f') f: NgForm;

  constructor(_formBuilder: FormBuilder,
    private apiService: ApiService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private teamservice : TeamService,
    private router: Router) {
    this.teamForm = _formBuilder.group({
      'email': ['', [Validators.email, Validators.required ]],
      'Teams' : ['']
    });
    

  }

  ngOnInit() {
// initialiser team  

this.teamservice.selectteam().subscribe( (res:any) => {
  this.Teamgroupe = res.teams
  
    })

    //this.pageSubscription = this.apiService.getUserPages().subscribe((res: any) => {
    this.pageSubscription = this.apiService.get('dashboards').subscribe(dashboards => {
      this.pages = dashboards['data']; 
      console.log('pages::', this.pages)

    })

 /*    this.apiService.get('team').subscribe((res: any) => {
      console.log("TEAM", res);
      // debugger;
      if(res.members.length>0){
        res.members.forEach(member => {
          this.team.push(member)
          this.teamEmails.push(member.member.email)
        })
      }      
    }) */
  }

  viewList(e){
      console.log("Selected Team memeber id slim ", e.value);
      this.idteam = e.value
      this.teamservice.selectmembers(e.value).subscribe((res :any) =>{
        if(res.members.length>0){
        res.members.forEach(member => {
          this.team.push(member)
          this.teamEmails.push(member.member.email)
        })
        console.log("slimmmmmmmm member" , this.team)
      }
       })
  }

  sumbit(f: NgForm, fg: FormGroup) {
    //set the unchecked checkboxes to false by default
    if(this.buttonType == 'Invite'){
    Object.keys(f.controls).forEach(formControl => {

      if (f.controls[formControl].value == "") {

        f.controls[formControl].setValue(false);
      }
    })

    /// load team 
    

    // Format the teamMemeber to be sent to the DB
    if(JSON.parse(window.localStorage.getItem('localuser')).email == fg.get('email').value){
      this.snackBar.open('Pack does allow adding team members', 'X', { duration: 2000 });
      document.querySelector('button[mat-raised-button][type=submit]').setAttribute('disabled', 'true')
    }
    let team = {};
    team['email'] = fg.get('email').value;
    team['team_id'] = 1;

    let _pages = []
    Object.keys(f.value).forEach(_value => {
      if (_value !== 'checkAll' && f.value[_value] == true) {
        _pages.push(_value);
      }
    })
    team['pages'] = _pages;
    team['token'] = this.apiService.userToken;
    team['user_id'] = this.apiService.userId;

    //TEST if the form is successully sent and reset it 
    //console.log("TEAM", team);

    this.teamservice.inviteteame('team/invite', team).subscribe((res: any) => {
      //console.log(res);
      if (res.errors == 0) {

        // Reset both forms after submission
        this.teamForm.get('email').reset();
        f.reset();

        this.snackBar.open('Team member added successfully', '✔', { duration: 2000 });
      } else if (res.errors == 1) {
        this.snackBar.open('Pack does allow adding team members', 'X', { duration: 2000 });
        document.querySelector('button[mat-raised-button][type=submit]').setAttribute('disabled', 'true')
      }
    })
    }
  }



  // Subscription to the change event on MatCheckBox for select All pages
  selectAll(selected) {
 
    if (selected.checked) {
      Object.keys(this.f.controls).forEach((formControl) => {        
        this.f.controls[formControl].setValue(true);
      });
    } else {
      Object.keys(this.f.controls).forEach((formControl) => {
        this.f.controls[formControl].setValue(false);
      });
    }

  }

  selection_changed(selected){
    if(selected.checked){
      let allChecked = true;
      Object.keys(this.f.controls).forEach((formControl) => {
        if(formControl !== 'checkAll'){
          if (this.f.controls[formControl].value == false)
            allChecked = false;
        }
      });
      if (allChecked) 
        this.f.controls['checkAll'].setValue(true);
    }
    else{
      this.f.controls['checkAll'].setValue(false);
    }
  }

  ngOnDestroy() {
    // this.pageSubscription.unsubscribe();
    // this.teamSubscripttion.unsubscribe();
  }

  onEdit(member) {

    member.dashboards.forEach(dashboard => {
        this.pages.forEach(page => {
        if(dashboard["id"]==page.id ) {
          page.checked=true;
          this.f.controls[page.id].setValue(true);
          // console.log(this.f.controls['92']);
          // console.log(dashboard["id"]+"="+page.id);
          // console.log(page.checked);
        }
        else {
            page.checked=false;
            console.log(page.id+" : "+page.checked);
        }
      });
    });
    
    //console.log('member data::', member);
    this.iditenfiantmembre=member.member.id
    this.teamForm.get('email').setValue(member.member.email);
     this.changeButton();

  }

  changeButton() {
    if(this.teamForm.get('email').value != '' && this.teamEmails.includes(this.teamForm.get('email').value)){
      this.buttonType = 'Update';
    }
    else {
      // this.f.reset();
       Object.keys(this.f.controls).forEach(control => {
        this.f.controls[control].setValue(false);
      })
      this.buttonType = 'Invite';
    }
  }

  mailChanged(event){
    this.changeButton();
  }


  updateMember(){
    let _dashboards = []

    Object.keys(this.f.controls).forEach(_value=>{
      if(this.f.controls[_value].value == true){
        _dashboards.push(_value);

      }
    })  

    let payLoad = {
      "team_id": this.member.member.pivot.team_id,
      "user_id": this.member.member.pivot.user_id,
      "dashboards": _dashboards
    }


    this.teamservice.EditMmember(payLoad).subscribe((res:any) => {
        if(res.errors==0){
          this.teamForm.get('email').reset();
          Object.keys(this.f.controls).forEach(control => {
            this.f.controls[control].setValue(false);
          })
          this.buttonType = 'Invite';
          this.snackBar.open('Team member updated successfully', '✔', { duration: 2000 });
        }
        else
          this.snackBar.open('Something went wrong!', 'X', { duration: 2000 });
    })

  }

  toggleSelection(id){
    this.f.controls[id].setValue(this.f.controls[id].value == true ? false : true )
  }

  onDelete(member) {
    console.log(member);
    let _member = {
      "user_id": member.member.id,
      "team_id": this.idteam
    }

    // Should add confirmation before deletion

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {toDelete: 'Member'},
      width: '300px',
      height: '150px',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        //debugger;
        this.teamservice.deletemembers(_member).subscribe((res: any) => {
          console.log(res);
          if (res.errors == 0) {
            this.team = this.team.filter(m => m.member.id != member.member.id);
          }
        })
      }
    })
  }
  Createteam(){
    this.teamservice.createteam(this.name).subscribe(res =>{
    console.log(res)
    })
  }
  Gettlistteam(){
   // teamgroupe
   this.teamservice.selectteam().subscribe( (res:any) => {
console.log(res.teams)
this.Teamgroupe = res.teams

  })
  }

 
}