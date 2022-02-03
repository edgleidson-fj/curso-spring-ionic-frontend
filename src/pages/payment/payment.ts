import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  pedido: PedidoDTO;

  //Vetor
  parcelas: number[] = [1,2,3,4,5,6,7,8,9,10];

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder) {

      this.pedido = this.navParams.get('pedido');//Pegando o pedido que veio da outra pagina.

      this.formGroup = this.formBuilder.group({
        numeroDeParcelas: [1, Validators.required],//Padrao = 1, obrigatorio.
        "@type": ['pagamentoComCartao', Validators.required]//Padrao = pagamentoComCartao, obrigatorio.

      });
  }

  nextPage() {
    this.pedido.pagamento = this.formGroup.value;//Pegando o pagamento selecionado no formulario.
    this.navCtrl.setRoot('OrderConfirmationPage', {pedido: this.pedido});
  }

}
