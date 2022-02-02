import { useEffect, useState } from 'react';
import { rota } from './rota';

import Header from "./components/header/Header";
import Card from "./components/card-resumo/Card";
import Table from './components/table/Table';
import Modal from './components/modal/Modal';
import TableHead from './components/table-head/TableHead';
import Filter from './components/section-filter/Filter';

import filtro from './assets/filtro.svg';

function App() {
  const [resumeValues, setResumeValues] = useState({})
  const [categorias, setCategorias] = useState([])
  const [registros, setRegistros] = useState([])
  const [mostrar, setMostrar] = useState([])
  const [filtroSetings, setFiltroSetings] = useState({
    aberto: false,
    dias: [],
    tags: [],
    min: '',
    max: '',
    apply: false
  })

  const [diasFiltro] = useState([
    { nome: "Domingo", tipo: "dia" },
    { nome: "Segunda", tipo: "dia" },
    { nome: "Terça", tipo: "dia" },
    { nome: "Quarta", tipo: "dia" },
    { nome: "Quinta", tipo: "dia" },
    { nome: "Sexta", tipo: "dia" },
    { nome: "Sábado", tipo: "dia" }
  ]);

  const [modalValues, setModalValues] = useState({
    id: "",
    aberto: false,
    title: "Adicionar",
    tipo: "debit",
    valor: "",
    categoria: "",
    data: "",
    descricao: ""
  })



  async function loadList() {
    try {
      const response = await fetch(`${rota}/transactions`, {
        method: 'GET'
      });

      const data = await response.json();
      setRegistros(data)
      let allCategorias = [];
      for (let item of data) {
        allCategorias.push(item.category)
      };

      allCategorias = allCategorias.filter(function (item, i) {
        return allCategorias.indexOf(item) === i;
      });
      const novasCategorias = allCategorias.map(item => {
        return { nome: item, tipo: "tag" }
      })
      setCategorias(novasCategorias);
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    loadList()
  }, []);


  function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor);
  }

  function mascaraMoeda(value) {
    value = value.toString();
    const onlyDigits = value
      .split("")
      .filter(s => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    return maskCurrency(digitsFloat);
  }

  useEffect(() => {
    let novaLista = [...registros]
    if (filtroSetings.apply) {
      if (filtroSetings.dias.length > 0) {
        const dias = filtroSetings.dias.join(' ')
        novaLista = novaLista.filter(item => dias.includes(item.week_day))
      }
      if (filtroSetings.tags.length > 0) {
        const tags = filtroSetings.tags.join(' ')
        novaLista = novaLista.filter(item => tags.includes(item.category))
      }
      if (filtroSetings.min !== '' && filtroSetings.min !== "R$ 0,00") {
        const valor = filtroSetings.min;
        let value = valor.replace('R$', '').replace(',', '');
        while (value.includes(".")) {
          value = value.replace('.', '')
        }
        value = Number(value)
        novaLista = novaLista.filter(item => item.value >= value)
      }
      if (filtroSetings.max !== '' && filtroSetings.max !== "R$ 0,00") {
        const valor = filtroSetings.max;
        let value = valor.replace('R$', '').replace(',', '');
        while (value.includes(".")) {
          value = value.replace('.', '')
        }
        value = Number(value)
        novaLista = novaLista.filter(item => item.value <= value)
      }
    }
    setMostrar(novaLista)
  }, [filtroSetings, registros])

  useEffect(() => {
    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(valor);
    }

    function mascaraMoeda(value) {
      value = value.toString();
      const onlyDigits = value
        .split("")
        .filter(s => /\d/.test(s))
        .join("")
        .padStart(3, "0");
      const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
      return maskCurrency(digitsFloat);
    }

    const entradas = mostrar.reduce((acc, cur) => {
      if (cur.type === 'credit') {
        acc += Number(cur.value)
      }
      return acc
    }, 0);

    const saidas = mostrar.reduce((acc, cur) => {
      if (cur.type === 'debit') {
        acc += Number(cur.value)
      }
      return acc
    }, 0);

    const newResume = {
      entradas: mascaraMoeda(entradas),
      saidas: mascaraMoeda(saidas),
      balance: saidas > entradas ? "-" + mascaraMoeda(entradas - saidas) : mascaraMoeda(entradas - saidas)
    }

    setResumeValues(newResume)
  }, [mostrar])

  function abrirfiltros() {
    const novoFiltro = { ...filtroSetings };
    novoFiltro.aberto = !novoFiltro.aberto;
    setFiltroSetings(novoFiltro)
  }

  return (
    <div>
      <Header />
      <div className='container-body'>
        <section className='container-body-content'>
          <div className="container-body-left">
            <button className="open-filters-button" onClick={abrirfiltros}>
              <img src={filtro} alt="filtro" />
              <span>Filtrar</span>
            </button>
            <Filter diasFiltro={diasFiltro} categorias={categorias} filtroSetings={filtroSetings} setFiltroSetings={setFiltroSetings} />
            <section className="table">
              <TableHead registros={registros} setRegistros={setRegistros} />
              <div className="table-body">
                {
                  mostrar.map(item => <Table className="table-line" item={item} setModal={setModalValues}
                    requireLines={loadList} key={item.id}
                    mascaraMoeda={mascaraMoeda} />)
                }
              </div>
            </section>
          </div>
        </section>
        <section className="container-body-right">
          <Card entrada={resumeValues.entradas} saida={resumeValues.saidas} balance={resumeValues.balance} setModalValues={setModalValues} />
        </section>
      </div>
      <Modal modal={modalValues} setModal={setModalValues} requireLines={loadList} />
    </div>
  );
}

export default App;
