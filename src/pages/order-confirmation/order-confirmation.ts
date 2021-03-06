import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../service/domain/cart.service';
import { ClienteService } from '../../service/domain/cliente.service';
import { PedidoService } from '../../service/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;

  //Colecao.
  cartItems: CartItem[];

  cliente: ClienteDTO;

  endereco: EnderecoDTO;

  codpedido: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService) {

      this.pedido = this.navParams.get('pedido'); //Pegando paramentro que veio da outra pagina.
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items; //Pegando os itens do carrinho.

    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      });
  }

  //Buscar endereco.
  findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO{
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total() : number {
    return this.cartService.total();
  } 

  //Voltar para tela de carrinho.
  back(){
    this.navCtrl.setRoot('CartPage');
  }

  //Voltar para tela de categorias.
  home(){
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout(){
    this.pedidoService.insert(this.pedido)
     .subscribe(response => {
      this.codpedido = this.extractId(response.headers.get('location'));
      this.cartService.createOrClearCart(); //Limpar carrinho.      
     },
     error =>{
       if(error.status == 403){
        this.navCtrl.setRoot('HomePage');
       }
     });
  }

  //Extrair o ID do pedido que esta no location. ex: http://localhost:8080/pedidos/3
  private extractId(location : string) : string {
    let position = location.lastIndexOf('/');//Pegar o valor a partir da ultima '/', ou seja o ID do pedido.
    return location.substring(position +1, location.length);//Recortar entre (inicio= posicao determinada, final).
  }

}
