import { ApiService } from './../api.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {

  products:any;

  handler: any;
  paySubscription : Subscription;
  processingPayment: boolean = false;
  selectedproduct;
  selectedPack;

  currency = 'TND';
  period = 'yearly';
  objectKeys = Object.keys;
  objectValues = Object.values;
  
  
  constructor(private apiService: ApiService, private router: Router, private paymenySnackBar: MatSnackBar) { 
    //#region old products
    /*
    this.products=[
      {title: 'Starter', about: '4 Accounts | 2 Users', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, doloremque.', product_id: 'prod_DYS24DvJcjFhqR',
      plans: [
        {id:'201809_s_y' , name: 'Yearly'},
        {id:'201809_s_s' , name: 'Semestrial'},
        {id:'201809_s_q' , name: 'Quarterly'},
        {id:'201809_s_m' , name: 'Monthly'},
      ]},

      {title: 'Pro', about: '10 Accounts | 5 Users', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, doloremque.', product_id: 'prod_DYS24DvJcjFhqR',
      plans: [
        {id:'201809_s_y' , name: 'Yearly'},
        {id:'201809_s_s' , name: 'Semestrial'},
        {id:'201809_s_q' , name: 'Quarterly'},
        {id:'201809_s_m' , name: 'Monthly'},
      ],
    },

      {title: 'Business', about: '40 Accounts | 10 Users', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, doloremque.',product_id: 'prod_DYS24DvJcjFhqR',
      plans: [
        {id:'201809_s_y' , name: 'Yearly'},
        {id:'201809_s_s' , name: 'Semestrial'},
        {id:'201809_s_q' , name: 'Quarterly'},
        {id:'201809_s_m' , name: 'Monthly'},
      ]},

      {title: 'Wide', about: '100 Accounts | 12 Users', desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, doloremque.', product_id: 'prod_DYS24DvJcjFhqR',
      plans: [
        {id:'201809_s_y' , name: 'Yearly'},
        {id:'201809_s_s' , name: 'Semestrial'},
        {id:'201809_s_q' , name: 'Quarterly'},
        {id:'201809_s_m' , name: 'Monthly'},
      ]}
    ];
    */
    //#endregion
  
    this.products = {
        "features": [
            "subscription",
            "social account",
            "max. fans number",
            "data history",
            "additional team members",
            "dashboard",
            "audience insights",
            "trends & engagement reports",
            "benchmark",
            "custom benchmark",
            "national report",
            "branding & design",
            "email & support"
        ],
        "packs": [
            {
                "title": "starter",
                "subscription": {
                  "yearly": "800",
                  "monthly": "1000"
                } ,
                "social account": "4",
                "max. fans number": "300K",
                "data history": "2 years",
                "additional team members": "2",
                "dashboard": "true",
                "audience insights": "true",
                "trends & engagement reports": "true",
                "benchmark": "2",
                "custom benchmark": "true",
                "national report": "false",
                "branding & design": "true",
                "email & support": "true",
                "color": "#6c92db"
            },
            {
                "title": "pro",
                "subscription": {
                  "yearly": "800",
                  "monthly": "1000"
                } ,
                "social account": "10",
                "max. fans number": "500K",
                "data history": "2 years",
                "additional team members": "3",
                "dashboard": "true",
                "audience insights": "true",
                "trends & engagement reports": "true",
                "benchmark": "5",
                "custom benchmark": "true",
                "national report": "false",
                "branding & design": "true",
                "email & support": "true",
                "color": "#ff5349"
            },
            {
                "title": "business",
                "subscription": {
                  "yearly": "800",
                  "monthly": "1000"
                } ,
                "social account": "20",
                "max. fans number": "NO LIMIT",
                "data history": "2 years",
                "additional team members": "5",
                "dashboard": "true",
                "audience insights": "true",
                "trends & engagement reports": "true",
                "benchmark": "10",
                "custom benchmark": "true",
                "national report": "true",
                "branding & design": "true",
                "email & support": "true",
                "color": "#ffa924"
            },
            {
                "title": "wide",
                "subscription": {
                  "yearly": "800",
                  "monthly": "1000"
                } ,
                "social account": "100",
                "max. fans number": "NO LIMIT",
                "data history": "2 years",
                "additional team members": "20",
                "dashboard": "true",
                "audience insights": "true",
                "trends & engagement reports": "true",
                "benchmark": "40",
                "custom benchmark": "true",
                "national report": "true",
                "branding & design": "true",
                "email & support": "true",
                "color": "#27ae61"
            },
            {
                "title": "growth",
                "subscription": {
                  "yearly": "800",
                  "monthly": "1000"
                } ,
                "social account": "100",
                "max. fans number": "NO LIMIT",
                "data history": "2 years",
                "additional team members": "20",
                "dashboard": "true",
                "audience insights": "true",
                "trends & engagement reports": "true",
                "benchmark": "40",
                "custom benchmark": "true",
                "national report": "true",
                "branding & design": "true",
                "email & support": "true",
                "color": "#7e6990"
            }
        ],
        "options": [
            {
              "user": 120,
              "page": 100,
              "benchmark": 555
            }
        ]
      }
    
  }

  ngOnInit() {

    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '',
      locale: 'auto',
      closed: this.dialogClosed.bind(this),
      token: token =>{

        if(this.selectedPack && this.selectedproduct){
          let payLoad ={};
            // payLoad["pack_id"]= "201809_s_m";
            payLoad["pack_id"]= this.selectedPack;
            payLoad["product_id"]= this.selectedproduct;
            payLoad["stripeToken"] = token.id;
    
            console.log("payLoad",payLoad);
           this.paySubscription = this.apiService.post('pay', payLoad)
            .subscribe(
              (res:any) => {
                if(res.code==200){
                  this.paymenySnackBar.open('Payment done successfully', '✔', {duration: 1500});

                  this.processingPayment = false;

                  // console.log("After Token is return", this.processingPayment);
                  

                  this.router.navigate(['/app/packs'])
                  .then(res=>console.log(res))
                  .catch(err => console.log(err))
                }
              })
      }
      }
    });
  }

  setPeriod(){
    this.period = this.period == 'yearly' ? 'monthly' : 'yearly';
    console.log(this.period);
    
  }

  buyPack(product_id, f: NgForm){

    console.log("product_id", product_id);
    console.log("pack_id", f.value.payment_plan);

    this.selectedproduct =  product_id;
    this.selectedPack = f.value.payment_plan;

    this.processingPayment = true;

    this.handler.open({
      name: 'Kpeiz',
      description: 'Deposit Funds to Account',
    });
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }
  
  dialogClosed(){
    this.processingPayment = false;    
  }

  ngOnDestroy(){
  }

}
