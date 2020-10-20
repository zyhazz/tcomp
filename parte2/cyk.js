let cyk = []

function doCYK() {
  let word = $("#cyk1").val();
  let wordTokens = breakExp(word, alfabeto, variaveis);

  console.log(wordTokens);

  cyk[0] = []

  //primeiro nivel
  wordTokens.forEach(function (token, i) {
    cyk[0][i] = rules[localizaRefVariavel(token.value)];
  })

  console.log(cyk)

  let nivel = wordTokens.length - 1;

  for (let k = 1; k < wordTokens.length; k++) {
    cyk[k] = []
    for (let j = 0; j < nivel; j++) {
      console.log(cyk[k - 1][j][0], cyk[k - 1][j + 1][0])
      cyk[k][j] = '' + k + ':' + j + '->';
    }
    nivel--;
  }

  printCYK()
}

function printCYK() {
  let pp = "";
  cyk.forEach(function (linha) {
    pp += linha.reduce(function (s, item, i) {
      return s + i + ":" + item[0].value + "\t"
    }, "")
    pp += '\n';
  })

  console.log(pp)
}

function localiza(variaveis) {

  var indexes = [], i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;

  return rules.findIndex(function (item) {
    return item.length == 3 && item[2].value == variavel
  })
}