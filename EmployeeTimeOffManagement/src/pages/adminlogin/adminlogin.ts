import { Component } from '@angular/core';
import { NavController, AlertController, ModalController,PopoverController,ActionSheetController,LoadingController, Loading,IonicPage } from 'ionic-angular';
import { LogoutPopover } from '../../pages/logoutpopover/logoutpopover';
import { LoginPage } from '../../pages/login/login';
import { Create } from '../../pages/create/create';
import {OnlineService} from '../../pages/providers/onlineservice';

@Component({
  selector: 'page-adminlogin',
  templateUrl: 'adminlogin.html'
})
export class AdminLogin {
  userDetails:any;
loading:Loading;
  ngOnInit(): void {
   this.getUserList();
  }
  constructor(public navCtrl: NavController,public onlineService:OnlineService,  private alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController, public modalPopup:ModalController,private loadingCtrl: LoadingController) {

  this.userDetails=[];
}

 getUserList(){
    if(navigator.onLine){
      this.showLoading();
  this.onlineService.getFromAPI(this.onlineService.baseURL+'getAllUsers').subscribe(
          data=> { 
               if(data.length> 0){
                  this.userDetails=data;
                  
               }
               else{
               this.userDetails=[];
                  this.loading.dismiss();
              }
              
          },
          error=>{ 
             
                  this.loading.dismiss();
           this.onlineService.showValidationError("Error","Failed to get user Detils");
          }
          )
    }
     else{
       this.onlineService.showValidationError("Network error","Please check internet connection and try again later.");
    }
  
}
  
   public openSettingsPopover(event){
    let popover = this.popoverCtrl.create(LogoutPopover);
    popover.present({
      ev: event
    });
  }
     public opentask(permission){
        const viewModal = this.modalPopup.create(Create,{details:permission});
         viewModal.present();
    }
sendNotification(userlist){
console.log(userlist);
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