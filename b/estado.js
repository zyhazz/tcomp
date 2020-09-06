class Estado {
  constructor(nome) {
    this.nome = nome;
    this.final = false;
    this.transicoes = []
  }
  setFinal() {
    this.final = true;
  }
  isFinal() {
    return this.final;
  }
  pegaTransicao(valor) {
    return this.transicoes.find(function (i) {
      return i.valor == valor;
    });
  }
}