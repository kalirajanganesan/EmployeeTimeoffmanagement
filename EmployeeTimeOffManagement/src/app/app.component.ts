import { Component, ViewChild  } from '@angular/core';
import { AlertController, Nav,Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  // rootPage:any = HomePage;
   rootPage:any = LoginPage;
  
  // constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
  constructor(public platform: Platform,
   public statusBar: StatusBar,
              public splashScreen: SplashScreen,public push: Push,
              public alertCtrl: AlertController) {
    platform.ready().then(() => {
        sessionStorage.setItem('token',"");
     this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
    });
  }
  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.log('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: '794486692122'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
       sessionStorage.setItem('token',data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              this.presentConfirm(data);
              //TODO: Your logic here
           //   this.nav.push(DetailsPage, { message: data.message });
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
       // this.nav.push(DetailsPage, { message: data.message });
       this.presentConfirm(data);
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
  presentConfirm(data) {
  let alert = this.alertCtrl.create({
    title: data.title,
    message: data.message,
    buttons: [
       {
         text: 'OK',
         role: 'cancel',
        handler: () => {
          console.log('cancel');
        }
      }
    ]
  });
  alert.present();
}

}

