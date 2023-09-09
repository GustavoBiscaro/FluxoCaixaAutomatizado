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
