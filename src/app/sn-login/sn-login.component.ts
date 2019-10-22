import { ApiService } from './../api.service';
import { AuthenticationService } from './../auth/authentication.service';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { SocialUser } from "angularx-social-login";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { parsePhoneNumber } from 'libphonenumber-js';
import {Configuration} from '../configuration'

@Component({
	selector: 'sn-login',
	templateUrl: './sn-login.component.html',
	styleUrls: ['./sn-login.component.scss']
})
export class SnLoginComponent implements OnInit, OnDestroy, AfterViewInit {

	isLinear = false;
	pages;
	user: SocialUser;
	provider_user = {};

	social_networks = ['FACEBOOK'];

	authenticateUser: number = 0;

	userForm: FormGroup;
	countryCode: string;
	invitationCode;
	returnUrl;
	isValidPhoneNumber = true;

	// website_pattern = /^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]+\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
	website_pattern = /^(?:(?:https?]?):\/\/)?(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]+\b)$/;
	phone_number_pattern = /^[-\d]*$/;
	
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


	subscription: Subscription;

	// To track if the User-pages componenet is rached to load uers's pages
	reached: boolean = false;

	@ViewChild('stepper') stepper: MatStepper;

	constructor(
		private authenticationService: AuthenticationService,
		_formBuilder: FormBuilder,
		private apiService: ApiService,
		private config : Configuration,
		private router: Router,
		private route: ActivatedRoute) {

		this.userForm = _formBuilder.group({
			'firstName': ['', Validators.required],
			'lastName': ['', Validators.required],
			'email': ['', [Validators.email, Validators.required]],
			'company': ['', Validators.required],
			'company_type': ['', Validators.required],
			'website': ['', [Validators.pattern(this.website_pattern), Validators.required]],
			'job': ['', Validators.required],
			'countryCode': ['', Validators.required],
			'phone': ['', [Validators.pattern(this.phone_number_pattern) ,Validators.required]]
			});
		this.countryCode = '+216';
		this.userForm.controls['countryCode'].setValue(this.countryCode);
	}

	ngAfterViewInit() {
		window.localStorage.clear();

    	this.userForm.controls['phone'].valueChanges.subscribe(val => {
			if(val && val !== '' && this.countryCode && this.countryCode !== ''){
				this.phoneChanged(this.countryCode + val);
			}
    	})
	}

	ngOnInit() {

		this.route.queryParams.subscribe(
			(params: Params) => {
				console.log(params['invited']);
				this.invitationCode = params['invited'];
				console.log(params['returnUrl']);

				this.returnUrl = params['returnUrl']
			})
		// 	// UserStatus should be 2 to navigate user to the app (1 for testing purposes + need to check token)

		// if clicked
		if (this.authenticateUser !== 1) {
			console.log('User didn\'t ask to authenticate');
		} else if (this.authenticateUser == 1 && this.user) {
			console.log('User asked to authenticate');
			this.signin();
		};
	}

	signin() {
		this.authenticationService.signInWithFacebook().then(user => {
			// console.log("FaceBook Response", user);

			this.user = user;
			
			console.log(user);
			// console.log('facebook response:');
			
			//console.log("000000");;

			let kpeizUser = {
				'name': user.name,
				'signup_type': 'handleProvider',
				'provider': user.provider,
				'id': user.id, 
				'user_token': user.authToken,
				'email': user.email,
			}

			

			if (this.invitationCode != null) {
				kpeizUser['invitation_code'] = this.invitationCode;
			}

			var p = this.user.provider;
			this.provider_user[p] = this.user;
			let connectedUser;

			//console.log("KpeizUser : ", kpeizUser);

			// if(button clicked)
			this.authenticationService.signup(kpeizUser).subscribe((res: any) => {

				console.log('kpeizUserrrrrrrrrrrrrrrrrrrr', kpeizUser);
				//console.log("Response Singup", res);
				
				connectedUser = res.data.user;
				this.config.login.dx = true
				// connectedUser['token'] = res.data.token.token_type + " " + res.data.token.access_token;
				connectedUser['token'] = res.data.token;

				console.log(connectedUser['token']);

				//console.log("connectedUser", connectedUser);

				//Store the connectedUser in localStorage
				window.localStorage.setItem('localuser', JSON.stringify(connectedUser));

				//check KPEIZ user API if known or unknown user (first time user). 
				//console.log("DEBUGGGEERRRRRRRRRR");

				// debugger;

				// check object integrity before here 
				console.log('kpeizUser',connectedUser);

				switch (connectedUser.status) {
					//social network subscriber
					case 0:// stepperIndex=1; 
						this.setStepperIndex(1);
						Object.keys(this.userForm.controls)
							.forEach(formCntrl => {
								if(user[formCntrl] && user[formCntrl] !== ''){								
									this.userForm.get(formCntrl).setValue(user[formCntrl])
								}
							})

						break;

					//social network + Form subscriber
					case 1: //stepperIndex=2; 
					
						this.setStepperIndex(2);
						this.reached = true;
						break;

					//social network + Form subscriber + took first action
					case 2: //go to app 
						//Should navigate User to the app and set userStuts to 2
						this.navigateUser();
						break;
					default: break;
				}
			})

		}).catch(err => console.log("Something Went Wrong", err))
	}

	signInWith(sn): void {
		this.authenticateUser = 1;
		switch (sn) {
			case "GOOGLE": {
				this.authenticationService.singInWithGoogle();
				break;
			}
			case "FACEBOOK": {
				this.signin();
				break;
			}
			default: {
				console.log("default");
				break;
			}
		}

	}

	//Make API request to update user Info
	// Should be refactored to update userStatus to 2 when user completes all the steps 
	updateInfo(f: FormGroup) {


		let formUser = f.value;

		let _user = JSON.parse(window.localStorage.getItem('localuser'));
		let id = _user.id;
		formUser.id = _user.id;
		formUser.status = 1;

		this.reached = true;


		console.log("FORM User", formUser);

		//user object to update the existing user in the DB
		let u = {};

		u["id"] = id,
			u["name"] = f.get('firstName').value + ' ' + f.get('lastName').value,
			u["email"] = f.get('email').value,
			u['status'] = 1;
		u["data"] = JSON.stringify({
			company: f.get('company').value,
			company_type: f.get('company_type').value,
			job: f.get('job').value,
			countryCode: f.get('countryCode').value,
			phone: f.get('phone').value,
			website: f.get('website').value
		})
		this.apiService.updateUser(u).subscribe(
			(res: any) => {
				console.log("Update Response ", res);

				if (res.errors == 0) {
					this.reached = true;
					_user.status = 1;
					window.localStorage.setItem('localuser', JSON.stringify(_user));
					this.stepper.selectedIndex = 2;
				}
			},
			(error) => {
				// should be handeled by a UI alert
				console.log(error);
			}
		)
	}

	navigateUser() {
		if (this.returnUrl) {
			this.router.navigate([this.returnUrl])
				.then(res => console.log(res))
				.catch(err => console.log(err))
		} else {
			// this.router.navigate(['/app/analytics/home'])
			// 	.then(res => console.log(res))
			// 	.catch(err => console.log(err));
			
			/*---------------------------------
			//WHEN THE COMPONENT IS RENDERED INSIDE THE IFRAME -> SHOULD REDIRECT PARENT WINDOW
			/---------------------------------*/
			// LOCAL 
			//window.top.location.href="https://kpeiz.local:4200/app/analytics/home";
			window.top.location.href="https://localhost:4200/app/analytics/home";
			// PREPROD
			// window.top.location.href="https://app.preprod.kpeiz.digital/app/analytics/home"
		}
	}

	setStepperIndex(stepperIndex: number) {
		this.stepper.selectedIndex = stepperIndex;
	}

	ngOnDestroy() {}


	phoneChanged(val) {
		let number: any;
		try{
			number = parsePhoneNumber(val)
			this.isValidPhoneNumber = number.isValid();
		}
		catch(Exception){
			this.isValidPhoneNumber = false;
			console.log('phone number :',number,this.isValidPhoneNumber);			
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

	login(){
		console.log('tesst');
		this.config.login.dx = true
	}
	backlogin(){
		this.config.login.dx = false;
		this.config.backlogin.dx = true
		
	}
}