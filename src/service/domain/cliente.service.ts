import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx"; //Importação correta do Observable.
import { API_CONFIG } from "../../config/api.config";
import { ClienteDTO } from "../../models/cliente.dto";
import { ImageUtilService } from "../image-util.service";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public imageUtilService: ImageUtilService){
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    //Buscando imagem do Bucket (Amazon S3).
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'});
    }

    //Salvar novo usuario.
    insert(obj : ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    //Atualizar imagem do perfil.
    uploadPicture(picture) {
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture); //Convertendo para Blob.
        
        let formData : FormData = new FormData(); //FormData necessario para envio de arquivo.
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`, 
            formData,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}