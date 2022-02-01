import { Injectable } from "@angular/core";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";
import { StorageService } from "../storage.service";

@Injectable()
export class CartService{

    constructor(public storage: StorageService){
    }

    //Criar ou limpar carrinho.
    createOrClearCart() : Cart {
        let cart: Cart = {items: []}; //Lista vazia.
        this.storage.setCart(cart);
        return cart;
    }

    //Obter o carrinho
    getCart() : Cart {
        let cart: Cart = this.storage.getCart();
        if(cart == null){
            cart = this.createOrClearCart();
        }
        return cart;
    }

    //Adicionando produto ao carrinho
    addProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position == -1){  // (-1) = Significa que nao existe na lista.
            cart.items.push({quantidade:1 , produto: produto}); //Inserir.
        }
        this.storage.setCart(cart);
        return cart;
    }
}