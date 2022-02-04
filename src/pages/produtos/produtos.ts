import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../service/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  //Colecao.
  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  //Carregar dados.
  loadData(){
    let categoria_id = this.navParams.get('categoria_id'); //Pegando o parametro, que veio da pagina anterior.
    let loader = this.presentLoading(); //Iniciando Loading.

    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        loader.dismiss(); //Finalizando Loading.
        this.items = response['content'];
        this.loadImageUrls();
      },
      error => {
        loader.dismiss();
      });
  }

  //Carregando as imagens.
  loadImageUrls(){
    for(var i=0; i<this.items.length; i++){
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
        error => {});        
    }
  }

  //Mostrar detalhe.
  showDetail(produto_id : string){
    this.navCtrl.push('ProdutoDetailPage', {produto_id : produto_id});
  }

    //Componente Loading.
    presentLoading() {
      let loader = this.loadingCtrl.create({
        content: "Aguarde..."
      });
      loader.present();
      return loader;
    }
  
    //Componente Refresher.
    doRefresh(refresher) {
      this.loadData();
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }
  
}