import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx"; //Importação correta do Observable.
import { API_CONFIG } from "../../config/api.config";
import { ClienteDTO } from "../../models/cliente.dto";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient,
        public storage: StorageService){
    }

    findByEmail(email: string) : Observable<ClienteDTO> {
        let token = this.storage.getLocalUser().token;//Pegando o valor do Token.
        let authHearder = new HttpHeaders({'Authorization': 'Bearer '+ token});//Cabecalho/Header.

        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
            {'headers': authHearder});
    }

    //Buscando imagem do Bucket (Amazon S3).
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'});
    }
}