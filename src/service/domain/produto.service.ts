import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx"; //Importação correta do Observable.
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class ProdutoService{

    constructor(public http: HttpClient){
    }

    finById(produto_id : string){
        return this.http.get<ProdutoDTO>(`${API_CONFIG.baseUrl}/produtos/${produto_id}`);
    }

    findByCategoria(categoria_id: string){
        return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
    }

    //Pegar a imagem pequena do bucket - Amazon S3.
    getSmallImageFromBucket(id : string) : Observable<any>{
        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
        return this.http.get(url, {responseType : 'blob'});
    }

    //Pegar a imagem grande do bucket - Amazon S3.
    getImageFromBucket(id : string) : Observable<any>{
        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`;
        return this.http.get(url, {responseType : 'blob'});
    }
}