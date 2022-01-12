import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciasDTO } from "../models/credencias.dto";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

    constructor(
        public http: HttpClient,
        public storage: StorageService){
    } 
    
    authenticate(creds : CredenciasDTO){
         return this.http.post(`${API_CONFIG.baseUrl}/login`,
                                creds, 
                                  {
                                     observe: 'response',
                                     responseType: 'text'
                                 })
    }

    successFulLogin(authorizationValue : string){
        let tok = authorizationValue.substring(7);//Recortar o string a partir do 7º caracter.
        let user : LocalUser = {
            token: tok
        }
        this.storage.setLocalUser(user);//Guardando usuario no LocalStorage.
    }

    logout(){
        this.storage.setLocalUser(null);//Usuario nulo.
    }
}