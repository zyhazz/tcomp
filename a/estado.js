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
  pegaTransicoes(valor) {
    return this.transicoes.filter(function (i) {
      return i.valor == valor || i.valor == '&';
    });
  }
}