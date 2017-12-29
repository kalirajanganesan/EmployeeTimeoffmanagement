import { Component , Input, ViewChild} from '@angular/core';
import {Platform ,ViewController, ModalController, NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { AdminLogin } from '../../pages/adminlogin/adminlogin';
import {OnlineService} from '../../pages/providers/onlineservice';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  loading:Loading;
  validationMessage:string;
  isAdmin:boolean;
   registerCredentials:{ username: string,password:string };
  constructor(public navCtrl: NavController,public onlineService:OnlineService, public viewCtrl: ViewController, private modalPopup: ModalController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
  this.registerCredentials={ username: "",password:"" };
  this.isAdmin=false;
       if(sessionStorage.getItem('username') && sessionStorage.getItem('username')!="null"){
       this.onlineService.registerCredentials.userName=sessionStorage.getItem('username');
       this.onlineService.registerCredentials.password=sessionStorage.getItem('password');
        this.navCtrl.push(HomePage);
     }
     else{
     sessionStorage.setItem('username',null);
     sessionStorage.setItem('password',null);
     }
  }
 login(){
  //  if(this.validateEmail(this.registerCredentials.username)===true){
  //   this.validationMessage="";
    this.loginvalid();
  //  }
  //  else{
  //     this.validationMessage="Please enter valid email";
  //  }
   
 }
 loginvalid(){
     //if(this.validateEmail(this.registerCredentials.userName)){
        if(navigator.onLine){
    // this.navCtrl.push(HomePage);
    this.showLoading();
    this.registerCredentials.username=this.registerCredentials.username.split(' ').join('').toLowerCase();
     this.onlineService.registerCredentials.userName=this.registerCredentials.username;
     this.onlineService.registerCredentials.password=this.registerCredentials.password;
      let token=sessionStorage.getItem('token');
      if(token && token!=null || token!=undefined){
       token=token;
      }
      else{
        token="";
      }
      console.log(token);
     this.onlineService.getFromAPI(this.onlineService.baseURL+'Login?userName='+this.registerCredentials.username+'&password='+this.registerCredentials.password+'&token='+token).subscribe(
          data=> { 
               sessionStorage.setItem('username',this.registerCredentials.username);
               sessionStorage.setItem('password',this.registerCredentials.password);
              //  sessionStorage.setItem('id',this.registerCredentials.id);
                if(this.isAdmin===true){
          this.navCtrl.push(AdminLogin);
            }
            else
            this.navCtrl.push(HomePage);
          },
          error=>{ 
            this.loading.dismiss();
            // this.navCtrl.push(HomePage);
           this.onlineService.showValidationError("Authentication failed","Please enter valid credential and try again later.");
          }
          )
    }
    else{
       this.onlineService.showValidationError("Network error","Please check internet connection and try again later.");
    }
   // else{
     // this.validationMessage="Please enter valid email";
    //  this.onlineService.showValidationError("Invalid Email","Please enter valid email");
  //  }
   }
    validateEmailBlur(){
   if(this.validateEmail(this.registerCredentials.username)===false){
     this.validationMessage="Please enter valid email";
   }
   else{
     this.validationMessage="";
   }
 }

    validateEmail(username) {
        var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if (filter.test(username)) {
            return true;
        }
        else {
            return false;
        }
    }
      showLoading() {
    this.loading = this.loadingCtrl.create({
             spinner:'ios',
       cssClass:'loadingStyle',
        content: 'Please wait...',
       dismissOnPageChange: true
    });
    this.loading.present();
  } 
}