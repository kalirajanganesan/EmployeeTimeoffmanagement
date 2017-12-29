import { Component, OnInit } from '@angular/core';
import {App, NavParams, NavController, Loading, IonicPage } from 'ionic-angular';
@Component({
    selector: 'app-container',
    templateUrl: `chartpage.html`
})
export class ChartPage implements OnInit {
    public piedata: Object[];
    public datalabel: Object;
    public enableSmartLabels: boolean;
    public legendSettings: Object;
    ngOnInit(): void {
        this.datalabel = { visible: true, name: 'text', position: 'Inside' };
        this.enableSmartLabels = true;
        this.piedata = [
                { x: 'Late', y: 1, text: 'Late: 1' }, { x: 'General permission', y: 3, text: 'General permission: 3' },
                { x: 'Late night permission', y: 2, text: 'Late night permission: 2' },,
         ];
                this.legendSettings = {
            position: 'Right',
            visible: true,
            height: '40',
            width: '160'
        };
    }
      constructor(public app:App ,private navparams: NavParams,private nav: NavController) {
 
   }
     back(){
     this.nav.pop();
 }

}