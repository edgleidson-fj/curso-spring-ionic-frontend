import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { CidadeService } from '../../service/domain/cidade.service';
import { EstadoService } from '../../service/domain/estado.service';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
  ],
  providers: [  //Declarando os Providers diretamente na pagina (Signup).
    CidadeService,
    EstadoService
  ]
})
export class SignupPageModule {}
