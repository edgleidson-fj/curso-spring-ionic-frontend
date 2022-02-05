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

  //Colecao iniciando vazia para concatenar as respostas.
  items: ProdutoDTO[] = []; 

  page: number = 0;

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

    this.produtoService.findByCategoria(categoria_id, this.page, 10) //Buscar de 10 em 10.
      .subscribe(response => {
        let inicio = this.items.length; //Tamanho que a lista tinha.
        this.items = this.items.concat(response['content']); //Concatenando a resposta.
        let fim = this.items.length - 1; //Tamanho que a lista tem agora, menos 1.
        loader.dismiss(); //Finalizando Loading.      
        this.loadImageUrls(inicio, fim);
      },
      error => {
        loader.dismiss();
      });
  }

  //Carregando as imagens.
  loadImageUrls(inicio: number, fim: number){
    for(var i=inicio; i<=fim; i++){
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
      this.page = 0;
      this.items = []; //lista vazia..
      this.loadData();
      setTimeout(() => {
        refresher.complete();
      }, 1000); //1 segundo.
    }

    //Componente Infinite Scroll.
    doInfinite(infiniteScroll) {
      this.page++;
      this.loadData();
      setTimeout(() => {
        infiniteScroll.complete();
      }, 1000);
    }
  
}