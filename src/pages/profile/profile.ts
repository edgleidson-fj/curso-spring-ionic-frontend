import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../service/storage.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){//localUser && localUserEmail existem. 
      this.email = localUser.email;
    }
  }

}
