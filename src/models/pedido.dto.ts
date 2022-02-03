import { ItemPedidoDTO } from "./item-pedido.dto";
import { PagamentoDTO } from "./pagamento.dto";
import { RefDTO } from "./ref.dto";

export interface PedidoDTO{
    cliente : RefDTO; //recebendo o objeto (RefDTO -> id).
    enderecoDeEntrega : RefDTO;
    pagamento : PagamentoDTO;
    itens : ItemPedidoDTO[]; //lista.
}