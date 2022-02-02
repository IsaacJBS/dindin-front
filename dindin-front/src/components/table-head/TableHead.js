import '../table-head/tableHead.css';

import { useState } from "react";
import cresc from '../../assets/setaFiltro.svg';
import decr from '../../assets/setaFiltroDown.png';

function TableHeader({ registros, setRegistros }) {
    const [order, setOrder] = useState({ ordem: "", sentido: false });

    function orderBy(event) {
        const newOrder = { ...order }

        newOrder.ordem = event.target.id;
        newOrder.sentido = !order.sentido;

        let newRegistros = [...registros]
        if (newOrder.ordem === '') {
            return
        }
        if (newOrder.ordem === 'date') {
            newRegistros = newOrder.sentido ? newRegistros.sort((a, b) => {
                return (+ new Date(a.date)) - (+ new Date(b.date))
            }) : newRegistros.sort((a, b) => {
                return (+ new Date(b.date)) - (+ new Date(a.date))
            });
        }
        if (newOrder.ordem === 'week-day') {
            newRegistros = newOrder.sentido ? newRegistros.sort((a, b) => {
                return (new Date(a.date).getDay()) - (new Date(b.date).getDay())
            }) : newRegistros.sort((a, b) => {
                return (new Date(b.date).getDay()) - (new Date(a.date).getDay())
            });
        }
        if (newOrder.ordem === 'value') {
            newRegistros = newOrder.sentido ? newRegistros.sort((a, b) => {
                return Number(a.value) - Number(b.value)
            }) : newRegistros.sort((a, b) => {
                return Number(b.value) - Number(a.value)
            });
        }

        setOrder(newOrder)
        setRegistros(newRegistros)
    }

    return (
        <div className="table-head">
            <h2 onClick={orderBy} id="date" className="column-title data-column">
                Data {order.ordem === 'date' && <img src={order.sentido ? cresc : decr} alt={order.sentido ? 'asc' : 'desc'} />}
            </h2>
            <h2 onClick={orderBy} id="week-day" className="column-title day-column">
                Dia da semana {order.ordem === 'week-day' && <img src={order.sentido ? cresc : decr} alt={order.sentido ? 'asc' : 'desc'} />}
            </h2>
            <h2 className="column-title descricao-column">Descrição</h2>
            <h2 className="column-title category-column">Categoria</h2>
            <h2 onClick={orderBy} id="value" className="column-title valor-column">
                Valor {order.ordem === 'value' && <img src={order.sentido ? cresc : decr} alt={order.sentido ? 'asc' : 'desc'} />}
            </h2>
        </div>
    )
}



export default TableHeader;