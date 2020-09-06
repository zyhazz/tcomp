class NFA {
  constructor(estados, alfabeto, transicoes, inicial, finais) {
    this.estados = [];
    let nfa = this;

    estados.forEach(function (e) {
      let estado = new Estado(e)
      nfa.estados.push(estado)
    })

    this.alfabeto = alfabeto;

    transicoes.forEach(function (t) {
      nfa.pegaEstado(t[0]).transicoes.push(new Transicao(t[1], t[2]));
    })

    this.inicial = this.pegaEstado(inicial)

    finais.forEach(function (f) {
      nfa.pegaEstado(f).setFinal()
    })
    console.log(this);
  }

  pegaEstado(nome) {
    return this.estados.find(function (i) {
      return i.nome == nome;
    });
  }

  verificar(string, el) {
    //el.value = "";
    el.append('Verificando string:' + string + "\n");
    string = string.split('');
    let nfa = this;
    let atual = this.inicial;
    string.forEach(function (d, i) {
      let tr = atual.pegaTransicao(d);
      if (tr) {
        atual = nfa.pegaEstado(tr.destino);
      }
      el.append("posicao:" + (i + 1) + " valor:" + d + " destino:" + atual.nome + "\n");
      console.log(i, "valor:", d, " destino:", atual.nome)
    });

    el.append(atual.isFinal() ? 'String aceita\n' : 'String não aceita\n');

    console.log('isFinal', atual.isFinal());
  }
}