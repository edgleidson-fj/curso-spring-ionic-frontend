import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../service/domain/cart.service';
import { ClienteService } from '../../service/domain/cliente.service';
import { StorageService } from '../../service/storage.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  //Colecao.
  items: EnderecoDTO[];

  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){//localUser && localUserEmail existem. 
      this.clienteService.findByEmail(localUser.email)
        .subscribe( response => {
          this.items = response['enderecos'];

          let cart = this.cartService.getCart(); //pegando o carrinho do localStorage.

          this.pedido = {
            cliente : {id: response['id']},
            enderecoDeEntrega : null, //Nulo provisoriamente.
            pagamento : null,
            //Funcao Lambda para percorre a lista(map) convertendo o objeto para (quantidade, (Produto.id)).
            itens : cart.items.map(x => {return {quantidade: x.quantidade , produto: {id: x.produto.id}}})
          }

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

  nextPage(item: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = {id: item.id};
    this.navCtrl.push('PaymentPage', {pedido: this.pedido}); //Passando parametro. 
  }

}