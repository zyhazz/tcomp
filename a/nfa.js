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
    let r = 'Verificando string:' + string + "\n";
    string = string.split('');
    let nfa = this;
    let atual = [this.inicial];

    string.forEach(function (d, i) {
      let next = []
      atual.forEach(function (a, j) {
        let tr = a.pegaTransicoes(d);
        if (tr) {
          tr.forEach(function (t) {
            next.push(nfa.pegaEstado(t.destino));
            console.log(i, "valor:", d, " destino:", t.destino)
            r += "posição:" + (i + 1) + " valor:" + d + " destino:" + t.destino + "\n";
          })
        }
      })
      atual = next;
    });
    
    console.log('estados finais:', atual)

    let aceita = atual.some(function (i) {
      return i.isFinal()
    })

    el.value = r + (aceita ? 'String aceita\n' : 'String não aceita\n');
  }
}