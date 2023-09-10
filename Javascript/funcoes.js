const Modulo = {
    abrir(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modulo-sobreposicao')
            .classList
            .add('active')
  
    },

    fechar(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modulo-sobreposicao')
            .classList
            .remove('active')
    },
  }

  const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("fluxo-caixa:transacoes")) || []
    },
  
    set(transactions) {
        localStorage.setItem("fluxo-caixa:transacoes", JSON.stringify(transactions))
    }
  }
  
  const Transaction = {
    all: Storage.get(),
  
    add(transacao){
        Transaction.all.push(transacao)
  
        App.reload()
    },
  
    remove(index) {
        Transaction.all.splice(index, 1)
  
        App.reload()
    },
  
    entradas() {
        let entrada = 0;
        Transaction.all.forEach(transaction => {
        if( transaction.quantia > 0 ) {
               entrada += transaction.quantia;
            }
        })
        return entrada;
    },
  
    saidas() {
        let saida = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.quantia < 0 ) {
                saida += transaction.quantia;
            }
        })
        return saida;
    },
  
    total() {
        return Transaction.entradas() + Transaction.saidas();
    }
  }
  
  const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
  
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
  
        DOM.transactionsContainer.appendChild(tr)
    },
  
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "entrada" : "saida"
  
        const amount = Utils.formatCurrency(transaction.amount)
  
        const html = `
        <td class="descricao">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="data">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `
  
        return html
    },
  
    atualizarBalanco() {
        document
            .getElementById('entradaDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.entradas())
        document
            .getElementById('saidaDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.saidas())
        document
            .getElementById('total-tela')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
  
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
  }
  
  const Utils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },
  
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
  
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
  
        value = String(value).replace(/\D/g, "")
  
        value = Number(value) / 100
  
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
  
       return signal + value
    }
  }
  
  const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
  
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
  
    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },
  
    formatValues() {
        let { descricao, quantia, data } = Form.getValues()
        
        amount = Utils.formatAmount(quantia)
  
        date = Utils.formatDate(data)
  
        return {
            descricao,
            quantia,
            data
        }
    },
  
    clearFields() {
        Form.descricao.value = ""
        Form.quantia.value = ""
        Form.quantia.value = ""
    },
  
    submit(event) {
        event.preventDefault()
  
        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
  }
  
  const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.atualizarBalanco()
  
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
  }
  
  App.init()