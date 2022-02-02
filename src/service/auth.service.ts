import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { API_CONFIG } from "../config/api.config";
import { CredenciasDTO } from "../models/credencias.dto";
import { LocalUser } from "../models/local_user";
import { CartService } from "./domain/cart.service";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public cartService: CartService){
    } 
    
    authenticate(creds : CredenciasDTO){
         return this.http.post(`${API_CONFIG.baseUrl}/login`,
                                creds, 
                                  {
                                     observe: 'response',
                                     responseType: 'text'
                                 })
    }

    refreshToken(){
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`,
                               {}, 
                                 {
                                    observe: 'response',
                                    responseType: 'text'
                                })
   }

    successFulLogin(authorizationValue : string){
        let tok = authorizationValue.substring(7);//Recortar o string a partir do 7º caracter.
        let user : LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub//Pegando email a partir do token.
        }
        this.storage.setLocalUser(user);//Guardando usuario no LocalStorage.
        this.cartService.createOrClearCart();//Limpando o carrinho.
    }

    logout(){
        this.storage.setLocalUser(null);//Usuario nulo.
    }
}