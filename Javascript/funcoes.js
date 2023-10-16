const Modal = {
    abrir() {
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modulo-sobreposicao')
            .classList
            .add('active')

    },

    fechar() {
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modulo-sobreposicao')
            .classList
            .remove('active')
    },
}

const Armazenamento = {
    get() {
        return JSON.parse(localStorage.getItem("fluxoCaixa:transacoes")) || []
    },

    set(transacoes) {
        localStorage.setItem("fluxoCaixa:transacoes", JSON.stringify(transacoes))
    }
}

const Transacao = {
    all: Armazenamento.get(),

    add(transacao) {
        Transacao.all.push(transacao)

      App.reload()//reload
    },

    remove(index) {
        Transacao.all.splice(index, 1)

        App.reload() //reload
    },

    entradas() {
        let entrada = 0;
        Transacao.all.forEach(transacao => {
            if (transacao.quantia > 0) {
                entrada += transacao.quantia;
            }
        })
        return entrada;
    },

    saidas() {
        let saida = 0;
        Transacao.all.forEach(transacao => {
            if (transacao.quantia < 0) {
                saida += transacao.quantia;
            }
        })
        return saida;
    },

    total() {
        return Transacao.entradas() + Transacao.saidas();
    }
}

const DOM = {
    transacoesContainer: document.querySelector('#tabela-dados tbody'),

    addTransacao(transacao, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = trans = DOM.innerHTMLTransacao(transacao, index)
        tr.dataset.index = index

        DOM.transacoesContainer.appendChild(tr)
    },

    innerHTMLTransacao(transacao, index) {
        const classeCSS = transacao.quantia > 0 ? "entrada" : "saida"

        const quantia = Utils.formatoMoeda(transacao.quantia)

        const html = `
        <td class="descricao">${transacao.descricao}</td>
        <td class="${classeCSS}">${quantia}</td>
        <td class="data">${transacao.data}</td>
        <td>
            <img onclick="Transacao.remove(${index})" src="./imagens/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    atualizarSaldo() {
        document.getElementById('entradaDisplay').innerHTML = Utils.formatoMoeda(Transacao.entradas())
        document.getElementById('saidaDisplay').innerHTML = Utils.formatoMoeda(Transacao.saidas())
        document.getElementById('total-tela').innerHTML = Utils.formatoMoeda(Transacao.total())
    },

    limparTransacoes() {
        DOM.transacoesContainer.innerHTML = ""
    }
}

const Utils = {
    formatoQuantia(valor) {
        valor = Number(valor.replace(/\,\./g, "")) * 100

        return valor
    },

    formatoData(date) {
        const dataDividida = date.split("-")
        return `${dataDividida[2]}/${dataDividida[1]}/${dataDividida[0]}`

    },

    formatoMoeda(valor) {
        const sinal = Number(valor) < 0 ? "-" : ""

        valor = String(valor).replace(/\D/g, "")

        valor = Number(valor) / 100

        valor = valor.toLocaleString("pt-BR", {
            estilo: "moeda",
            moeda: "BRL"
        })

        return sinal + valor

    }
}

const Form = {
    descricao: document.querySelector('input#descricao'),
    quantia: document.querySelector('input#quantia'),
    data: document.querySelector('input#data'),


    pegarValores() {
        return {
            descricao: Form.descricao.value,
            quantia: Form.quantia.value,
            data: Form.data.value
        }
    },

    validarCampos() {
        const { descricao, quantia, data } = Form.pegarValores()

        if (!descricao || !quantia || !data || descricao.trim() === "" || quantia.trim() === "" || data.trim() === "") {
            throw new Error("Por favor, preencha todos os campos");
        }
        
        
    },

    formatarValores() {
        let {descricao, quantia, data} =  Form.pegarValores()

        quantia = Utils.formatoQuantia(quantia)

        data = Utils.formatoData(data)

        return {
            descricao,
            quantia,
            data
        }
    },

    limparCampos() {
        Form.descricao.value = ""
        Form.quantia.value = ""
        Form.data.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validarCampos()
            const transacao = Form.formatarValores()
            Transacao.add(transacao)
            Form.limparCampos()
            Modal.fechar()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transacao.all.forEach(DOM.addTransacao)
        DOM.atualizarSaldo()
        Armazenamento.set(Transacao.all)
    },

    reload(){
        DOM.limparTransacoes()
        App.init()
    },
}

App.init()

