function getToken(str, alfabeto){
  alfabeto.forEach(function(el){
    let tk = []
    let i = str.indexOf(el)
    if(i != -1){
      console.log(str.slice(i, i + el.length), i, str, el, el.length)
    }
    return tk;
  })
}

class CNF {
  constructor(alfabeto, gramatica) {
    let cnf = this;
    this.reservados = ['$', '|'];
    this.alfabeto = alfabeto;

    this.variaveis = [];

    let tgr = [];
    gramatica.forEach(function (element) {
      element = element.split('$');//separando parte A de B na forma A -> B, -> representado por $
      if (element[1].includes("|")) {//vamos confiar que existe pelo menos e apenas um $, verificando se existe algum "ou", representado por |
        element[1].split("|").forEach(function (el) {
          tgr.push({
            nome: element[0],
            resultado: getToken(el, cnf.alfabeto)
          })
        })
    } else {
        //se for unica, adiciona ela
        tgr.push({
          nome: element[0],
          resultado: getToken(element[1], cnf.alfabeto)
        })
      }
    });
    console.log(tgr)

    this.estados = [];
    let nfa = this;

    estados.forEach(function (e) {
      let estado = new Estado(e)
      nfa.estados.push(estado)
    })



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

    console.log('isFinal', aceita);

    el.value = r + (aceita ? 'String aceita\n' : 'String não aceita\n');
  }
}