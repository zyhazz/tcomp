function NFAtoDFA() {
  let estados = [];
  let alfabeto;
  let transicoes = [];
  let inicial;
  let finais;

  alfabeto = nfa.alfabeto

  inicial = nfa.inicial.nome

  nfa.estados.forEach((e, i) => {
    processaEstado(e, alfabeto, estados, transicoes)
  });

  nfa.estados.forEach((enfa) => {
    if(enfa.isFinal()){
      estados.forEach(edfa => {
        if(edfa.nome.split(",").includes(enfa.nome)){
          edfa.setFinal();
        }
      })
    }
  })

  console.log(estados, transicoes)
  /*
  tabela = geraTabela(nfa)

  console.log(estados)
*/
  let dfa = new DFA(
    [],
    alfabeto,
    [],
    "",
    []
  );
  dfa.estados = estados
  dfa.inicial = dfa.pegaEstado(inicial)
  return dfa;
}

function mergeTransicoes(trs, valor, alfabeto) {
  //console.log(trs)
  if (trs.length > 1) {
    let tr = trs.reduce(function (prev, i) {
      prev.destino.push(i.destino)
      return prev
    }, new Transicao(valor, []))
    tr.destino = tr.destino.join(",")
    return tr
  } else if (trs.length == 1) {
    return new Transicao(valor, trs[0].destino);
  } else {
    return new Transicao(valor, "Ø");
  }
}

function pegaSubTransicoes(estados, nomes, valor) {
  nomes = nomes.split(",")
  let trs = []
  nomes.forEach((nome) => {
    trs = trs.concat(nfa.pegaEstado(nome).pegaTransicoes(valor))
  })
  return trs;
}

function processaEstado(estado, alfabeto, estados, transicoes) {
  let i = estados.find(function (i) {
    return i.nome == estado.nome;
  });
  if (i) {
    console.log(i)
    return;
  }

  let estadoDFA = Object.assign(new Estado, estado)
  estados.push(estadoDFA)
  let novasTrs = []
  alfabeto.forEach(letra => {
    let tr = mergeTransicoes(
      estado.nome.includes(",") ? pegaSubTransicoes(estados, estado.nome, letra) : estado.pegaTransicoes(letra), letra
    );
    novasTrs.push(tr)
    let ne = novoEstadoSeNaoExistir(estados, tr.destino);
    if (ne) {
      processaEstado(ne, alfabeto, estados, transicoes)
    }
  })
  estadoDFA.transicoes = novasTrs
}

function novoEstadoSeNaoExistir(estados, nome) {
  let i = estados.find((e) => {
    return e.nome == nome
  })
  if (!i) {
    let e = new Estado(nome);
    return e;
  } else {
    return false;
  }
}