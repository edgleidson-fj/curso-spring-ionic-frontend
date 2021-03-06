import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera'; //Import da Camera.
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../service/domain/cliente.service';
import { StorageService } from '../../service/storage.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  picture: string;
  
  cameraOn: boolean = false; //Camera desligada.

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  //Carregar dados.
  loadData(){
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){//localUser && localUserEmail existem. 
      this.clienteService.findByEmail(localUser.email)
        .subscribe( response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
        erro =>{
          if(erro.status == 403){
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else{
      this.navCtrl.setRoot('HomePage');
    }
  }

  //Verificar se imagem existe.
  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
    },
    error => {});
  }
  
  //Pegar imagem da camera.
  getCameraPicture() {
    this.cameraOn = true; //Camera ligada.

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false; //Camera desligada.
    }, (err) => {
    });
  }

  //Enviar imagem.
  sendPicture(){
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.loadData();
      },
      error => {});
  }

  //Descartar imagem.
  cancel(){
    this.picture = null;
  }
}