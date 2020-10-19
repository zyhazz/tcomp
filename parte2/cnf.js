let rSet = "$";
let rOr = "|";

var alfabeto = new Set();
var variaveis = new Set();
var setUnit = new Map();//literais
var solitarias = new Set();
var rules = [];

function toCNF() {
  alfabeto.clear();
  variaveis.clear();
  setUnit.clear();
  solitarias.clear();

  //alfabeto
  document.getElementById('alfabeto1').value.split(',').forEach(function (alfa) {
    alfabeto.add(alfa);
  });

  var PSet = $("#gramatica1").val();
  PSet = PSet.split("\n");

  //variaveis iniciais
  for (var i = 0; i < PSet.length; i++) {
    var LEFT = PSet[i].split(rSet)[0];
    variaveis.add(LEFT);
  }

  console.log("pset", PSet);
  console.log("alfabeto", alfabeto);
  console.log("variaveis", variaveis);

  //tokeniza
  for (var i = 0; i < PSet.length; i++) {
    var LEFT = PSet[i].split(rSet)[0];
    var RIGHT = PSet[i].split(rSet)[1];

    //processa ou
    var RHSSmall = RIGHT.split(rOr);

    for (var j = 0; j < RHSSmall.length; ++j) {
      let exp = [{
        value: LEFT,
        type: "left"
      }, {
        value: "$",
        type: "eq"
      },
      ...breakExp(RHSSmall[j], alfabeto, variaveis)
      ]
      console.log("expressao", RHSSmall[j], exp);
      rules.push(exp);
    }
  }

  //unica entrada S
  //A->BC
  //B->b
  //remover solitários B->C

  verificaUnicaEntrada();
  verificaMaximoDois();
  verificaVariaveis();
  verificaSolitarios();

  print();
}

function print() {
  //printa bonitim
  var arena = document.getElementById("cnf1");
  arena.innerHTML = "";
  for (var i = 0; i < rules.length; ++i) {
    arena.innerHTML += rules[i].reduce(function (s, r) {
      return s + r.value
    }, "") + "\n";
  }
  console.log("CNF String:\n", arena.innerHTML)
  console.log("CNF Tokens:", rules)
}

function isUnitaria(regra) {

}

function addRegra(regra) {
  let regratxt = regra.reduce(function (s, r) {
    return s + r.value
  }, "");

  let found = rules.find(function (item) {
    return regratxt == item.reduce(function (s, r) {
      return s + r.value
    }, "")
  })

  if (!found) {
    rules.push(regra)
  }
}

function verificaUnicaEntrada() {
  let entrada = rules[0][0];

  for (let r in rules) {
    let found = rules[r].find(function (item) {
      if (r < 2) {
        return false;
      } else {
        return item.value == entrada.value
      }
    })
    if (found) {
      let novaEntrada = nextVar()
      entrada.type = 'variavel';
      rules.unshift([
        {
          value: novaEntrada,
          type: "left"
        },
        {
          value: "$",
          type: "eq"
        },
        entrada
      ])
      return true;
    }
  }
  return false;
}

function verificaMaximoDois() {
  for (let r in rules) {
    if (rules[r].length > 4) {
      let novaEntrada = nextVar()
      addRegra([
        {
          value: novaEntrada,
          type: "left"
        },
        {
          value: "$",
          type: "eq"
        },
        ...rules[r].slice(3) //adiciona quem passar na cauda
      ])

      rules[r] = [
        ...rules[r].slice(0, 3),
        {
          value: novaEntrada,
          type: "variavel"
        }
      ];
      return verificaMaximoDois();
    }
  }
}

function verificaSolitarios() {
  for (let r in rules) {
    if (rules[r].length == 3 && rules[r][2].type == 'variavel') {
      s = rules[r][0].value + rules[r][1].value + rules[r][2].value;

      if (solitarias.has(s)) { // se já foi processada, apenas manda ela embora  
        rules.splice(r, 1);
        return verificaSolitarios();//reprocessa, rules modificado
      }

      solitarias.add(s)

      let variavelAtual = rules[r][2].value;
      let hit = true;

      rules.forEach((item, i) => {
        if (item[0].value == variavelAtual) {
          let regra = [...rules[0].slice(0, 2), ...item.slice(2)];
          if(regra[2].type == 'alfabeto'){
            regra = pegaOuInsereAlfabeto(regra[2].value);
          }
          if (r == 0 && hit) {
            hit = false;
            rules[0] = regra;//se for o ponto de entrada mantém posicao
          } else {
            addRegra(regra)//adiciona regra apontando para os novos
          }
        }
      });

      if (r != 0) {
        rules.splice(r, 1);
      }
      return verificaSolitarios();
    }
  }
}

function localizaRefVariavel(variavel) {
  return rules.findIndex(function (item) {
    return item.length == 3 && item[2].type == 'alfabeto' && item[2].value == variavel
  })
}

function pegaOuInsereAlfabeto(alfa) {
  let ref = localizaRefVariavel(alfa)
  let regra;

  if (ref != -1) {
    regra = rules[ref];
  } else {
    regra = [
      {
        value: nextVar(),
        type: "left"
      },
      {
        value: "$",
        type: "eq"
      },
      {
        value: alfa,
        type: "alfabeto"
      }
    ];
    addRegra(regra)
  }

  return regra;
}

function verificaVariaveis() {
  for (let r in rules) {
    if (rules[r].length > 3) {
      if (rules[r][2].type == 'alfabeto') {
        
        rules[r] = [
          ...rules[r].slice(0, 2), {
            value: pegaOuInsereAlfabeto(rules[r][2].value)[0].value,
            type: "variavel"
          },
          ...rules[r].slice(3)];

      } else if (rules[r][3].type == 'alfabeto') {
        
        rules[r] = [
          ...rules[r].slice(0, 2), {
            value: pegaOuInsereAlfabeto(rules[r][3].value)[0].value,
            type: "variavel"
          },
          ...rules[r].slice(4)];
      }
    }
  }
}

function nextVar() {
  for (var citer = 'A'.charCodeAt(0); citer <= 'z'.charCodeAt(0); ++citer) {
    if(citer == 90){
      citer = 97;//pula caracteres especiais
    }
    if (variaveis.has(String.fromCharCode(citer)) == false) {
      variaveis.add(String.fromCharCode(citer))
      return String.fromCharCode(citer);
    }
  }
}

function findFirst(str, alfabeto) {
  let found = false;
  alfabeto.forEach(function (final) {
    if (str.indexOf(final) == 0) {
      found = final
    }
  })
  return found;
}

function breakExp(exp, alfabeto, variaveis) {
  let fexp = [];

  while (exp.length > 0) {
    let alfa = findFirst(exp, alfabeto)
    if (alfa) {
      fexp.push({
        value: alfa,
        type: "alfabeto"
      })
      exp = exp.replace(alfa, "")
    } else {
      alfa = findFirst(exp, variaveis)
      if (alfa) {
        fexp.push({
          value: alfa,
          type: "variavel"
        })
        exp = exp.replace(alfa, "")
      } else {
        console.log("nao é alfabeto nem variável, WTF", exp, alfa);
        return false;
      }
    }
  }

  return fexp;
}