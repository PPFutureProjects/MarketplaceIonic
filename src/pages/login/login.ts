import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  userData = null;
  homePage = HomePage;
  splash=true;
  constructor(private facebook:Facebook,public navCtrl:NavController, public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

  loginWithFB(){
    this.facebook.login(['email', 'user_about_me']).then((response:FacebookLoginResponse)=> {
      let credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(credential).then((info) => {
        this.showToast(info.displayName);
      }).then(() => 
      this.facebook.api('me?fields=id,name,email,picture.width(720).height(720).as(picture_large)',[]).then(profile =>{
        this.userData = {email: profile['email'], picture: profile['picture_large']['data']['url'], username: profile['name']};
      }).then(() => this.navCtrl.setRoot(TabsPage,{
                                                              mail:this.userData.email,
                                                              foto:this.userData.picture,
                                                              nombre:this.userData.username
                                                            }
      )))
    });
  }

  bypass(){
    this.navCtrl.setRoot(TabsPage);
  }

  showToast(name) {
    const toast = this.toastCtrl.create({
      message: 'Bienvenido ' + name,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }
}
