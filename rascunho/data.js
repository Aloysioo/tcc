SITE_DATA = {
  aulas: [
    {
      id: "funcoes",
      title: "Funções — introdução",
      subject: "Matemática",
      tags: ["Função","Gráfico","ENEM"],
      summary: "Conceito de função, domínio, imagem e exemplos básicos.",
      content: "<h2>Definição</h2><p>Uma função é uma relação entre dois conjuntos em que cada elemento do primeiro conjunto (domínio) está associado a exatamente um elemento do segundo (contradomínio).</p><h3>Exemplo</h3><p>A função f(x) = 2x + 1 é linear. Seu gráfico é uma reta.</p>"
    },
    {
      id: "equacoes",
      title: "Equações do 1º e 2º grau — conceitos e resolução",
      subject: "Matemática",
      tags: ["Equações","2º grau","ENEM"],
      summary: "Resolução de equações lineares e quadráticas com exemplos.",
      content: "<h3>1º grau</h3><p>ax + b = 0 → isolamos x.</p><h3>2º grau</h3><p>Use Bhaskara: x = (-b ± √(b² - 4ac)) / (2a)</p>"
    },
    {
      id: "probabilidade",
      title: "Probabilidade — noções básicas",
      subject: "Matemática",
      tags: ["Probabilidade","Estatística","ENEM"],
      summary: "Eventos, espaço amostral, probabilidade clássica e exemplos.",
      content: "<p>P(A) = casos favoráveis / casos possíveis. Ex: carta de copas = 13/52 = 1/4.</p>"
    },
    {
      id: "biologia-celular",
      title: "Biologia celular — organelas e funções",
      subject: "Biologia",
      tags: ["Citologia","Célula","ENEM"],
      summary: "Estrutura da célula e funções das principais organelas.",
      content: "<h3>Mitocôndrias</h3><p>Produzem ATP; respiração celular.</p><h3>Ribossomos</h3><p>Síntese proteica.</p>"
    },
    {
      id: "gramatica",
      title: "Gramática — concordância verbal básica",
      subject: "Linguagens",
      tags: ["Português","Gramática","Concordância","ENEM"],
      summary: "Regras básicas de concordância verbal e exemplos práticos.",
      content: "<p>O verbo concorda com o sujeito em número e pessoa: 'O aluno estuda' / 'Os alunos estudam'.</p>"
    }
  ],

  questions: [
    {"id":"q1","subject":"Matemática","topic":"funcoes","year":2018,"statement":"Se f(x)=2x+1, qual é o valor de f(3)?","choices":[{"id":"a","label":"A","text":"5"},{"id":"b","label":"B","text":"6"},{"id":"c","label":"C","text":"7"},{"id":"d","label":"D","text":"8"}],"correctChoiceId":"c","explanation":"f(3)=2·3+1=7","difficulty":"fácil"},
    {"id":"q3","subject":"Matemática","topic":"equacoes","year":2019,"statement":"Resolva: 3x + 6 = 0.","choices":[{"id":"a","label":"A","text":"x = -2"},{"id":"b","label":"B","text":"x = 2"},{"id":"c","label":"C","text":"x = -3"},{"id":"d","label":"D","text":"x = 3"}],"correctChoiceId":"a","explanation":"3x = -6 → x = -2","difficulty":"fácil"},
    {"id":"q5","subject":"Matemática","topic":"probabilidade","year":2021,"statement":"Qual a probabilidade de tirar uma carta de copas em um baralho padrão de 52 cartas?","choices":[{"id":"a","label":"A","text":"1/2"},{"id":"b","label":"B","text":"1/4"},{"id":"c","label":"C","text":"1/13"},{"id":"d","label":"D","text":"3/4"}],"correctChoiceId":"b","explanation":"13/52 = 1/4","difficulty":"fácil"},
    {"id":"q6","subject":"Biologia","topic":"biologia-celular","year":2016,"statement":"Qual organela é a principal responsável pela produção de ATP na célula?","choices":[{"id":"a","label":"A","text":"Lisossomo"},{"id":"b","label":"B","text":"Cloroplasto"},{"id":"c","label":"C","text":"Mitocôndria"},{"id":"d","label":"D","text":"Ribossomo"}],"correctChoiceId":"c","explanation":"Mitocôndrias realizam a respiração celular e produzem ATP","difficulty":"fácil"},
    {"id":"q9","subject":"Linguagens","topic":"gramatica","year":2019,"statement":"Assinale a frase com concordância verbal correta:","choices":[{"id":"a","label":"A","text":"Houveram muitos alunos na palestra."},{"id":"b","label":"B","text":"Houve muitos alunos na palestra."},{"id":"c","label":"C","text":"Há muitos alunos na palestra ontem."},{"id":"d","label":"D","text":"Foram havidos muitos alunos."}],"correctChoiceId":"b","explanation":"'Haver' no sentido de existir é impessoal → 'Houve muitos alunos.'","difficulty":"média"}
  ]
};