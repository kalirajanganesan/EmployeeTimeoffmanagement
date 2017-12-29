import { Component } from '@angular/core';
import {App, NavParams,ToastController, ViewController, ModalController, NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import {OnlineService} from '../../pages/providers/onlineservice';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html',

})

export class Create {
  dismiss() {
     this.viewCtrl.dismiss();
   }
   
  loading: Loading;
fromTime:Date=new Date();
endTime:Date=new Date();
permission:string;
comments:string="";
watermark:string="select time";
userList:any;
currentUser:any;
  ngOnInit(): void {
    this.getUserList();
    
  }

  constructor(public app:App,public onlineService:OnlineService,private toastCtrl: ToastController, private navparams: NavParams,public viewCtrl: ViewController, private modalPopup: ModalController, private nav: NavController,  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
   this.permission=navparams.get('details');
        this.fromTime.setHours(9);
     this.fromTime.setMinutes(0);
     this.endTime.setHours(9);
     this.endTime.setMinutes(30);
   }
 
 getUserList(){
    if(navigator.onLine){
      this.showLoading();
  this.onlineService.getFromAPI(this.onlineService.baseURL+'getAllUsers').subscribe(
          data=> { 
               if(data.length> 0){
                  this.userList=data;
                  this.userList.forEach(element => {
                      if(element.UserName==this.onlineService.registerCredentials.userName)
                        this.currentUser=element;
                      });
               }
               else{
               this.userList=[];
              }
                this.loading.dismiss();
          },
          error=>{ 
                  this.loading.dismiss();
           this.onlineService.showValidationError("Error","Failed to get user list");
          }
          )
    }
     else{
       this.onlineService.showValidationError("Network error","Please check internet connection and try again later.");
    }
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
    public isStartTimeChanged(event){
   this.fromTime=event.value;
  }
    public isendTimeChanged(event){
   this.endTime=event.value;
  }
  createTask(type){
   console.log(type);
   if(navigator.onLine){
      this.showLoading();
      var inTime=this.endTime;
      var dateString=inTime.toLocaleDateString()+' '+inTime.toLocaleTimeString();
      var userId=this.currentUser ? this.currentUser.Id : 0;
      if(userId == 0 || userId == null){
          this.onlineService.showValidationError("Error","user not found");
          return;
      }
  this.onlineService.getFromAPI(this.onlineService.baseURL+'createJIRATask?permissionType='+type+'&userId='+userId+'&inTime='+dateString).subscribe(
          data=> { 
               this.loading.dismiss();
               let message="Task Created";
                this. back();
                this.presentToast(message);
          },
          error=>{ 
            this.loading.dismiss();
            
           this.onlineService.showValidationError("Error","Failed create");
          }
          )
    }
     else{
       this.onlineService.showValidationError("Network error","Please check internet connection and try again later.");
    }
  }
   presentToast(msg) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'top'
    });
   }
  
}