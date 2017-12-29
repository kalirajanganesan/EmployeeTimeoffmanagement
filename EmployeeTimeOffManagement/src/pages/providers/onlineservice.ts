import { Http, Jsonp, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

declare var jsSHA: any;

@Injectable()
export class OnlineService {
  registerCredentials:{ id:number, userName: string,password:string };
  public authorizationToken:string;
  public baseURL:string;
  constructor(private http: Http , private alertCtrl: AlertController) { 
    this.baseURL="http://23.92.60.74:99/v1/";
     this.registerCredentials={ id:0,userName: '',password:'' };
  }
  public postToAPI(credentials) {
             var headers = new Headers();
         this.createAuthorizationHeader(headers);
  return this.http
        .post(credentials,"",{headers: headers})
         .map(res => this.populateControls(res))
        .catch(error => this.handleGetControlsError(error));
  }
    public putToAPI(credentials) {
             var headers = new Headers();
         this.createAuthorizationHeader(headers);
  return this.http
        .put(credentials,"",{headers: headers})
         .map(res => this.populateControls(res))
        .catch(error => this.handleGetControlsError(error));
  }
   public postToAPIWithParams(credentials,params) {

  return this.http
        .post(credentials, params)
         .map(res => this.populateControls(res))
        .catch(error => this.handleGetControlsError(error));
  }

    public getFromAPI(URL) {
         var headers = new Headers();
         this.createAuthorizationHeader(headers);
        return this.http
       .get(URL,{headers: headers})
       // .get(URL)
         .map(res => this.populateControls(res))
        .catch(error => this.handleGetControlsError(error));
  }
  
    public getFromAPItoken(URL) {
         var headers = new Headers();
         this.createAuthorizationHeader(headers);
    
        return this.http
    //  .get(URL)
         .get(URL,{headers: headers})
         .map(res => this.populateControls(res))
        .catch(error => this.handleGetControlsError(error));
  }

 public populateControls(res){
  return res.json();
 }
  
 public handleGetControlsError(error){
  return Observable.throw(error);
 }
 createAuthorizationHeader(headers:Headers) {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authorizationToken); 
  }

    public appTokenGeneration(){
       return this.getFromAPI(this.baseURL+'GetExternalIP').subscribe(
          data=> {
            //console.log(data); 
            let token=this.tokenGeneration(data);
            return token;
          },
          error=>{ //console.log(error);
            this.showValidationError("Network error","Please check internet connection and try again later.");
            return null;
          }
          )
 } 
 tokenGeneration(externalIP){
    let ExternalIp=externalIP;
    // console.log(this.registerCredentials.userName);
     var DateTimeNow = new Date();
     var ticks = ((DateTimeNow.getTime() * 10000) + 621355968000000000);
     var USER_AGENT = navigator.userAgent;
     var _encAlgorithm = "HmacSHA256";
     var _accuratSalt = "lZf4IBOhNboNvbSal8Ku";

     var hash = this.registerCredentials.userName + ':' + ExternalIp + ':' + USER_AGENT + ':' + ticks.toString();
     var salt = _accuratSalt + ':' + this.registerCredentials.userName;
     var key = this.registerCredentials.password + ':' + salt;

         //for salt key
                var hmacKey = this.hmacKeyGeneration(salt, key.toString());

                var pass2HashSignup = hmacKey;
                var hashLeft = this.hmacKeyGeneration(hmacKey, hash.toString());
              //  console.log(hashLeft);
                var hashRight = this.registerCredentials.userName  + ":" + ticks;
                var hashee = hashLeft + ":" + hashRight;
                var Token = btoa(hashee.toString());
            //    console.log("AppToken: "+Token);
                return Token;
 }
  hmacKeyGeneration(hmacKey, hash) {
        var shaHash = null;
        shaHash = new jsSHA("SHA-256", "BYTES");
        shaHash.setHMACKey(hmacKey, "BYTES");
        shaHash.update(hash.toString());
        var hashLeft = shaHash.getHMAC("B64");
     //   console.log(hashLeft);
       return hashLeft;
    }
 public showValidationError(title,text){
      let alert = this.alertCtrl.create({
        cssClass:'alertPopupStyle',
        title: title,
        subTitle: text,
        buttons: ['OK']
       });
      alert.present();
   } 

}