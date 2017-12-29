import { Component } from '@angular/core';
import { NavController, AlertController, ModalController,PopoverController,ActionSheetController,LoadingController, Loading,IonicPage } from 'ionic-angular';
import { LogoutPopover } from '../../pages/logoutpopover/logoutpopover';
import { LoginPage } from '../../pages/login/login';
import { Create } from '../../pages/create/create';
import {OnlineService} from '../../pages/providers/onlineservice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading:Loading;
  pemissionActive:boolean;
  showDetails:boolean;
  expandicon:string;
  details:any;
  idselected:any;
  ngOnInit(): void {
    this.getPermissionDetails();
  }
  constructor(public navCtrl: NavController, public onlineService:OnlineService, private alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController, public modalPopup:ModalController,private loadingCtrl: LoadingController) {
  this.pemissionActive=true;
  this.showDetails=false;
  this.expandicon="md-arrow-dropright-circle";
   this.details=[];
  // this.details=[
  //   {id:1,expandicon:"md-arrow-dropright-circle"},
  //   {id:2,expandicon:"md-arrow-dropright-circle"},
  //   {id:3,expandicon:"md-arrow-dropright-circle"},
  //   {id:4,expandicon:"md-arrow-dropright-circle"},
  //   {id:5,expandicon:"md-arrow-dropright-circle"},
  //   {id:6,expandicon:"md-arrow-dropright-circle"},
  //   {id:7,expandicon:"md-arrow-dropright-circle"},
  //   {id:8,expandicon:"md-arrow-dropright-circle"},
  // ];

   if(sessionStorage.getItem('isQuickMode') && sessionStorage.getItem('isQuickMode')!="null"){
     if(sessionStorage.getItem('isQuickMode') ==="true"){
        this.presentConfirm();
     }
   }
   else{
     this.presentConfirm();
   }
}

getPermissionDetails(){
    if(navigator.onLine){
      this.showLoading();
  this.onlineService.getFromAPI(this.onlineService.baseURL+'getPermissionList?userName='+this.onlineService.registerCredentials.userName).subscribe(
          data=> { 
               if(data.length> 0){
                  data.forEach(element => {
                    element.expandicon="md-arrow-dropright-circle";
                  });
                  
                  this.details=data;
               }
               else{
               this.details=[];
              }
              // setTimeout(function(){
                  this.loading.dismiss();
              // },500);
              
          },
          error=>{ 
             
                  this.loading.dismiss();
            this.details=[];
           this.onlineService.showValidationError("Error","Failed to get user Detils");
          }
          )
    }
     else{
       this.onlineService.showValidationError("Network error","Please check internet connection and try again later.");
    }
  
}

showPermissions(){
   this.pemissionActive=true;
}
showLatelist(){
   this.pemissionActive=false;
}
expandDetails(Id,expandicon){
  
  for(let i=0;i<this.details.length;i++){
    if(this.details[i].Id===Id){
     if(this.details[i].expandicon==="md-arrow-dropdown-circle"){
       this.details[i].expandicon="md-arrow-dropright-circle";
       this.idselected="";
     }
     else{
      this.details[i].expandicon="md-arrow-dropdown-circle";
      this.idselected=Id;
     }
    }
    else{
       this.details[i].expandicon="md-arrow-dropright-circle";
    }
  }
//   if(this.showDetails===false){
//     this.showDetails=true;
// this.expandicon="md-arrow-dropdown-circle";
//   }
//   else{
//     this.showDetails=false;
//     this.expandicon="md-arrow-dropright-circle";
//   }
}
   presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',    
      buttons: [
        {
          text: 'Late',
          role: 'destructive',
          handler: () => {
           this.opentask("Late");
          }
        },{
          text: 'General Permission',
          handler: () => {
            this.opentask("General Permission");
          }
        },{
          text: 'Late night Permission',
          handler: () => {
            this.opentask("Late Night Permission");
          }
        },{
          text: 'Special Permission',
          handler: () => {
            this.opentask("Special Permission");
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  presentConfirm() {
  let alert = this.alertCtrl.create({
    title: 'Late task',
    message: 'Do you want to create late task?',
    buttons: [
       {
        text: 'Cancel',
         role: 'cancel',
        handler: () => {
          console.log('cancel');
        }
      },
      {
        text: 'Yes',
        role: 'cancel',
        handler: () => {
         this.opentask('Late');
        }
      },
      {
        text: 'More',
        handler: () => {
          this.presentActionSheet();
        }
      },
     
    ]
  });
  alert.present();
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