import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LogoutPopover } from '../pages/logoutpopover/logoutpopover';
import { Create } from '../pages/create/create';
import { ChartPage } from '../pages/chartpage/chartpage';
import { AdminLogin } from '../pages/adminlogin/adminlogin';

import { OnlineService } from '../pages/providers/onlineservice';

import { GridModule, Page} from '@syncfusion/ej2-ng-grids';
import { DatePickerModule } from '@syncfusion/ej2-ng-calendars';
import { TimePickerModule } from '@syncfusion/ej2-ng-calendars';
import { AccumulationChartModule } from '@syncfusion/ej2-ng-charts';
import { PieSeriesService, AccumulationDataLabelService } from '@syncfusion/ej2-ng-charts';
import { PageService, SortService} from '@syncfusion/ej2-ng-grids';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    Create,
    ChartPage,
LogoutPopover,
AdminLogin
  ],
  imports: [
    BrowserModule,
    // IonicModule.forRoot(MyApp),
    GridModule,
    DatePickerModule,
    TimePickerModule,
    AccumulationChartModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top', tabSubPages:false, mode:'ios'})  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    Create,
    ChartPage,
    LogoutPopover,
    AdminLogin
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    PageService, SortService,PieSeriesService, AccumulationDataLabelService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OnlineService
  ]
})
export class AppModule {}
