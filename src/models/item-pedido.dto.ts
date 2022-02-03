import { RefDTO } from "./ref.dto";

export interface ItemPedidoDTO{
    quantidade :  number;
    produto : RefDTO; //Receber o objeto(RefDTO -> id).
}