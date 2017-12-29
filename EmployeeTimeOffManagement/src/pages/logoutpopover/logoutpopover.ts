import { Component } from '@angular/core';
import {App,ToastController, NavParams, ViewController, ModalController, NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { ChartPage } from '../../pages/chartpage/chartpage';
import {OnlineService} from '../../pages/providers/onlineservice';

@Component({
  selector: 'page-logout',
  templateUrl: 'logoutpopover.html',

})

export class LogoutPopover {
  dismiss() {
     this.viewCtrl.dismiss();
   }
  loading: Loading;
  userName:string;
  isEnableQuickMode:boolean;
  constructor(private toastCtrl: ToastController, public app:App ,public onlineService:OnlineService,private navparams: NavParams,public viewCtrl: ViewController, private modalPopup: ModalController, private nav: NavController,  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.userName=this.onlineService.registerCredentials.userName;
    if(this.userName==""){
this.userName="user";
    }
    if(sessionStorage.getItem('isQuickMode') && sessionStorage.getItem('isQuickMode')!="null"){
     if(sessionStorage.getItem('isQuickMode') ==="true"){
        this.isEnableQuickMode=true;
     }
   }
   else{
     this.isEnableQuickMode=true;
     sessionStorage.setItem('isQuickMode',"true");
   }
   }
   public backtologin(){
     sessionStorage.setItem('username',null);
     sessionStorage.setItem('password',null);
  this.viewCtrl.dismiss();
  this.presentToast("User has loged out successfully");
  this.app.getRootNav().push(LoginPage);
  }
 startAction(){
   let isMode=this.isEnableQuickMode==true?false:true;
 sessionStorage.setItem('isQuickMode',isMode.toString());
 let message=isMode==true?"Quick mode enabled successfully":"Quick mode disabled";
 this.presentToast(message);
 }
 
 back(){
     this.nav.pop();
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
       public openchart(){
          this.viewCtrl.dismiss();
         //this.nav.push(ChartPage);
        const viewModal = this.modalPopup.create(ChartPage);
         viewModal.present();
    }

    presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

}