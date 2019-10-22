import { FacebookService } from './../facebook.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { User } from './user.model';
import {  FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { parsePhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  user: User;
  userForm: FormGroup;
  img_source: string;
  options = {
    // allowDropdown: false,
    autoHideDialCode: false,
    // autoPlaceholder: "off",
    // dropdownContainer: document.body,
    // excludeCountries: ["us"],
    // formatOnDisplay: true,
    // geoIpLookup: function(callback) {
    //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
    //     var countryCode = (resp && resp.country) ? resp.country : "";
    //     callback(countryCode);
    //   });
    // },
    hiddenInput: "full_number",
    initialCountry: "tn",
    // localizedCountries: { 'de': 'Deutschland' },
    nationalMode: false,
    // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
    // placeholderNumberType: "MOBILE",
    preferredCountries: ['tn'],
    // separateDialCode: true,
  }

  
  countryCode: string;
	website_pattern = /^(?:(?:https?]?):\/\/)?(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]+\b)$/;
  phone_number_pattern = /^[-\d]*$/;
  isValidPhoneNumber = true;
  asYouType: any;
  format: any;
  parse: any;

  constructor(_formBuilder: FormBuilder, 
              private apiService: ApiService, 
              private snackBar: MatSnackBar, 
              private dialogRef: MatDialogRef<UserProfileComponent>,
              private fbService: FacebookService) {
    this.userForm = _formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['', [Validators.email, Validators.required]],
      'company': ['', Validators.required],
      'company_type': ['', Validators.required],
      'website': ['', [Validators.pattern(this.website_pattern), Validators.required]],
      'job': ['', Validators.required],
      'countryCode': ['+216', Validators.required],
      'phone': ['', [Validators.pattern(this.phone_number_pattern) ,Validators.required]]
    })

  }

  ngOnInit() {
    this.fbService.getFbUser().subscribe(res => {
      this.img_source = res['picture'].data.url;
    });
    this.user = this.getUserProfile();
  }

  ngAfterViewInit() {

    // setTimeout(() => {
      console.log('user data countrycode:', JSON.parse(this.user['data']));
      
      this.userForm.controls['firstName'].setValue((this.user['name']).split(' ')[0]);
      this.userForm.controls['lastName'].setValue((this.user['name']).split(' ')[1]);
      this.userForm.controls['email'].setValue(this.user['email']);
      this.userForm.controls['company'].setValue(JSON.parse(this.user['data'])['company']);
      this.userForm.controls['company_type'].setValue(JSON.parse(this.user['data'])['company_type']);
      this.userForm.controls['website'].setValue(JSON.parse(this.user['data'])['website']);
      this.userForm.controls['job'].setValue(JSON.parse(this.user['data'])['job']);
      this.userForm.controls['phone'].setValue(JSON.parse(this.user['data'])['phone']);
      this.userForm.controls['countryCode'].setValue(JSON.parse(this.user['data'])['countryCode']);
      
      this.countryCode = this.userForm.controls['countryCode'].value;
      console.log('countryCode:', this.userForm.controls['countryCode']);
  
      this.userForm.controls['phone'].valueChanges.subscribe(val => {
        if(val && val !== '' && this.countryCode && this.countryCode !== ''){
          this.phoneChanged(this.countryCode + val);
        }
      })
    // });

  }
 
  getUserProfile() {
    let user = JSON.parse(window.localStorage.getItem('localuser'));
    return user == null ? [] : user;
  }

  setLocalStorage() {
    window.localStorage.setItem('localuser', JSON.stringify( this.user ));
  }

  updateUserProfile(f: FormGroup) {
    this.user['name'] = f.controls['firstName'].value + ' ' + f.controls['lastName'].value;
    this.user['email'] = f.controls['email'].value;
    this.user["data"] = JSON.stringify({
			company: f.controls['company'].value,
			company_type: f.controls['company_type'].value,
      job: f.controls['job'].value,
      countryCode: this.countryCode,
			phone: f.controls['phone'].value,
			website: f.controls['website'].value
    });

    console.log(this.user);
    // debugger;
        
    this.apiService.updateUser(this.user).subscribe((res: any) => {
      if(res.errors == 0){
        this.setLocalStorage();
        this.snackBar.open(res['message'], '✔', { duration: 1500 });
        this.dialogRef.close(true);
      }
      else
        this.snackBar.open(res.errors, 'X', { duration: 1500 });
    });
  }

  phoneChanged(val) {
    
    let number: any;
    try{
      number = parsePhoneNumber(val);
      console.log('isValidPhoneNumber', val);
      console.log('isValidPhoneNumber?', number.isValid());
      
      this.isValidPhoneNumber = number.isValid();
    }
    catch(Exception){
      this.isValidPhoneNumber = false;
      console.log('isValidPhoneNumber?', this.isValidPhoneNumber);
    }
  
  }

  countryChanged(val){
    this.onCountryChange(val);
    // if(val.length == 0 || val[0] != '+')
    //   this.phoneChanged(null);
    // console.log('countryChanged!:', val);

  }

  onCountryChange(val){
    this.countryCode = val.dialCode ? '+' + val.dialCode : val;
    this.phoneChanged(this.countryCode + this.userForm.controls['phone'].value);
  }

}
