import { Injectable } from "@angular/core";
import { Item } from "ionic-angular";
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
        if(position == -1){  // igual a (-1) = Significa que nao existe na lista.
            cart.items.push({quantidade:1 , produto: produto}); //Inserir.
        }
        this.storage.setCart(cart);
        return cart;
    }

    //Excluindo produto do carrinho
    removeProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1){  // diferente de (-1) = Significa que existe na lista.
            cart.items.splice(position, 1) //Remover. -> Numero(1) para indicar que é uma remocao.
        }
        this.storage.setCart(cart);
        return cart;
    }

    //Incrementar quantidade do produto ao carrinho
    increaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1){  
            cart.items[position].quantidade++; //Incrementar (++).
        }
        this.storage.setCart(cart);
        return cart;
    }

    //Decrementar quantidade do produto ao carrinho
    decreaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1){  
            cart.items[position].quantidade--; //Decrementar (--).
            if(cart.items[position].quantidade < 1){ //Menor que 1.
                cart = this.removeProduto(produto);
            }
        }
        this.storage.setCart(cart);
        return cart;
    }

    total() : number {
        let cart = this.getCart();
        let sum=0;
        for(var i=0; i<cart.items.length; i++){
            sum += cart.items[i].produto.preco * cart.items[i].quantidade;
        }
        return sum;
    }
}