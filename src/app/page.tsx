"use client";

import React, { useState, useMemo, FC, ReactNode } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Award, Sparkles, RotateCw, User } from 'lucide-react';

// --- INÍCIO DA ZONA SEGURA (TODA A LÓGICA FOI MOVIDA PARA CÁ) ---

// --- ESTRUTURA DE DADOS ---
type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type QuizLevel = {
  level: number;
  title: string;
  questions: Question[];
};

type PersonalizedQuestion = Question & {
  originalLevel: number;
};

// --- BANCO DE PERGUNTAS COMPLETO ---
const quizData: QuizLevel[] = [
    {
        level: 1,
        title: "Conceitos Fundamentais",
        questions: [
            { question: "O que uma IA Generativa faz?", options: ["Apenas armazena dados", "Cria conteúdo novo, como textos e imagens", "Controla computadores remotamente", "Corrige erros de hardware"], correctAnswer: "Cria conteúdo novo, como textos e imagens", explanation: "O diferencial da IA Generativa é sua capacidade de criar conteúdo original a partir dos padrões que aprendeu." },
            { question: "Qual é a principal diferença entre uma IA e um programa tradicional?", options: ["IA consome mais energia", "IA pode aprender e se adaptar", "IA é sempre mais rápida", "IA só funciona na internet"], correctAnswer: "IA pode aprender e se adaptar", explanation: "Diferente de programas tradicionais que seguem regras fixas, a IA pode aprender com dados e melhorar seu desempenho." },
            { question: "O que significa 'Machine Learning' em português?", options: ["Máquina Pesada", "Aprendizado de Máquina", "Computador Inteligente", "Sistema Automático"], correctAnswer: "Aprendizado de Máquina", explanation: "Machine Learning é a capacidade das máquinas aprenderem padrões a partir de dados sem serem explicitamente programadas." },
            { question: "Como a IA 'aprende'?", options: ["Lendo livros como humanos", "Analisando grandes quantidades de dados", "Copiando outros computadores", "Através de comandos de voz"], correctAnswer: "Analisando grandes quantidades de dados", explanation: "A IA aprende identificando padrões em grandes volumes de dados, similar a como reconhecemos rostos depois de ver muitos exemplos." },
            { question: "Por que o Spotify sugere músicas que você gosta?", options: ["Por acaso", "Usa IA para analisar seus gostos musicais", "Copia as preferências de seus amigos", "Sempre mostra as mais populares"], correctAnswer: "Usa IA para analisar seus gostos musicais", explanation: "O Spotify usa IA para analisar suas escolhas musicais e sugerir novas músicas com características similares." },
            { question: "Como o Waze sabe qual é o melhor caminho no trânsito?", options: ["Consulta mapas antigos", "Usa IA para analisar dados de trânsito em tempo real", "Segue sempre a rota mais curta", "Pergunta para outros motoristas"], correctAnswer: "Usa IA para analisar dados de trânsito em tempo real", explanation: "O Waze coleta dados de milhões de usuários e usa IA para calcular as rotas mais rápidas considerando o trânsito atual." },
            { question: "A Lu, assistente virtual do Magazine Luiza, é um exemplo de:", options: ["Robô físico", "IA conversacional brasileira", "Atriz contratada", "Sistema de vendas tradicional"], correctAnswer: "IA conversacional brasileira", explanation: "A Lu é uma das mais famosas assistentes virtuais brasileiras, usando IA para interagir com clientes e promover produtos." },
            { question: "Por que a Netflix mostra filmes diferentes para cada pessoa?", options: ["Para economizar internet", "Usa IA para personalizar recomendações", "Todos veem os mesmos filmes", "Mostra apenas filmes brasileiros"], correctAnswer: "Usa IA para personalizar recomendações", explanation: "A Netflix usa IA para analisar o que você assistiu e sugerir conteúdos similares aos seus gostos." },
            { question: "Como o Google Tradutor funciona?", options: ["Consulta dicionários físicos", "Usa IA para traduzir entre idiomas", "Humanos traduzem em tempo real", "Só traduz palavras simples"], correctAnswer: "Usa IA para traduzir entre idiomas", explanation: "O Google Tradutor usa IA treinada em milhões de textos em diferentes idiomas para fazer traduções." },
            { question: "Qual dessas é uma assistente virtual?", options: ["WhatsApp", "Alexa", "Instagram", "TikTok"], correctAnswer: "Alexa", explanation: "Alexa é um assistente virtual da Amazon que responde comandos de voz usando IA." },
            { question: "Como os assistentes virtuais entendem nossa voz?", options: ["Gravam tudo que falamos", "Usam IA para reconhecer padrões na fala", "Adivinham o que queremos", "Só funcionam com palavras específicas"], correctAnswer: "Usam IA para reconhecer padrões na fala", explanation: "Os assistentes usam IA de reconhecimento de voz para converter sons em palavras e entender comandos." },
            { question: "O ChatGPT é um exemplo de:", options: ["Rede social", "IA Generativa que cria textos", "Jogo online", "Editor de fotos"], correctAnswer: "IA Generativa que cria textos", explanation: "O ChatGPT é uma IA que pode gerar textos originais respondendo a perguntas e ajudando em diversas tarefas." },
            { question: "O que é um 'prompt' no ChatGPT?", options: ["Um erro no sistema", "A pergunta ou comando que você dá para a IA", "Um tipo de vírus", "Uma música"], correctAnswer: "A pergunta ou comando que você dá para a IA", explanation: "Prompt é como você 'conversa' com a IA, dando instruções claras para obter melhores respostas." },
            { question: "Como seu celular reconhece seu rosto para desbloquear?", options: ["Usa uma câmera especial", "IA de reconhecimento facial analisa características do rosto", "Compara com fotos salvas", "Funciona por temperatura"], correctAnswer: "IA de reconhecimento facial analisa características do rosto", explanation: "A IA mapeia pontos únicos do seu rosto e os compara com o modelo salvo no primeiro cadastro." },
            { question: "Por que algumas câmeras de celular fazem fotos melhores automaticamente?", options: ["Têm lentes mágicas", "Usam IA para ajustar configurações", "São sempre caras", "Copiam fotos da internet"], correctAnswer: "Usam IA para ajustar configurações", explanation: "A IA analisa a cena e automaticamente ajusta iluminação, foco e outras configurações para melhorar a foto." },
        ]
    },
    {
        level: 2,
        title: "Técnicas Essenciais",
        questions: [
            { question: "Como aplicativos como o Google Fotos organizam suas imagens?", options: ["Por data apenas", "IA reconhece pessoas, objetos e locais nas fotos", "Aleatoriamente", "Por tamanho do arquivo"], correctAnswer: "IA reconhece pessoas, objetos e locais nas fotos", explanation: "A IA identifica automaticamente rostos, animais, objetos e lugares para organizar e categorizar suas fotos." },
            { question: "O que acontece quando você fala 'Ok Google' ou 'Ei Siri'?", options: ["O celular liga", "IA reconhece o comando de ativação e começa a ouvir", "Abre um aplicativo", "Toca uma música"], correctAnswer: "IA reconhece o comando de ativação e começa a ouvir", explanation: "A IA está sempre 'ouvindo' por essas palavras-chave específicas para saber quando você quer dar um comando." },
            { question: "Por que o teclado do celular às vezes completa suas palavras?", options: ["Adivinha o que você pensa", "IA prevê palavras baseada no que você digitou", "Copia mensagens antigas", "É programado com todas as palavras"], correctAnswer: "IA prevê palavras baseada no que você digitou", explanation: "A IA analisa padrões de texto e aprende seu estilo de escrita para sugerir palavras e completar frases." },
            { question: "Como bancos detectam transações suspeitas?", options: ["Funcionários verificam tudo manualmente", "IA analisa padrões de gastos para identificar fraudes", "Bloqueia todas as compras online", "Só funciona durante o dia"], correctAnswer: "IA analisa padrões de gastos para identificar fraudes", explanation: "Bancos como o Nubank usam IA para aprender seus hábitos de gasto e identificar transações que fogem do padrão normal." },
            { question: "Como aplicativos como 99 e Uber calculam o preço da corrida?", options: ["Preço fixo sempre", "IA considera distância, trânsito e demanda", "Motorista decide o preço", "Só pela distância"], correctAnswer: "IA considera distância, trânsito e demanda", explanation: "A IA analisa múltiplos fatores em tempo real para calcular um preço justo baseado nas condições atuais." },
            { question: "Por que alguns aplicativos de delivery sugerem restaurantes específicos?", options: ["São pagos para aparecer primeiro", "IA analisa suas preferências e histórico de pedidos", "Aparecem aleatoriamente", "Só mostram os mais baratos"], correctAnswer: "IA analisa suas preferências e histórico de pedidos", explanation: "A IA aprende com seus pedidos anteriores para sugerir restaurantes e pratos que você provavelmente gostará." },
            { question: "O que faz um chatbot de atendimento ao cliente funcionar?", options: ["Pessoas digitando respostas", "IA que entende perguntas e busca respostas adequadas", "Respostas automáticas programadas", "Conexão direta com o gerente"], correctAnswer: "IA que entende perguntas e busca respostas adequadas", explanation: "Chatbots usam IA para entender a intenção do cliente e fornecer respostas relevantes ou direcionar para atendimento humano." },
            { question: "Por que você vê conteúdos específicos no feed do Instagram?", options: ["Aparecem em ordem cronológica", "IA seleciona conteúdo baseado em suas interações", "São escolhidos aleatoriamente", "Só aparecem posts de amigos"], correctAnswer: "IA seleciona conteúdo baseado em suas interações", explanation: "O algoritmo do Instagram usa IA para analisar suas curtidas, comentários e tempo de visualização para personalizar seu feed." },
            { question: "Como o TikTok sabe que vídeos mostrar para você?", options: ["Mostra os mais populares", "IA analisa seus gostos e comportamentos", "Vídeos são escolhidos pelos criadores", "Sempre mostra vídeos novos"], correctAnswer: "IA analisa seus gostos e comportamentos", explanation: "A IA do TikTok observa quais vídeos você assiste até o fim, curte ou compartilha para entender suas preferências." },
            { question: "O que são 'algoritmos' das redes sociais?", options: ["Pessoas que decidem o que você vê", "Programas de IA que personalizam o conteúdo", "Regras de comportamento online", "Sistemas de segurança"], correctAnswer: "Programas de IA que personalizam o conteúdo", explanation: "Algoritmos são sistemas de IA que decidem que conteúdo mostrar para cada usuário baseado em seus interesses e comportamentos." },
        ]
    },
    {
        level: 3,
        title: "Fluxos de Trabalho e Análise",
        questions: [
            { question: "Por que às vezes você vê propagandas relacionadas ao que pesquisou?", options: ["É coincidência", "IA usa seus dados para mostrar anúncios relevantes", "Alguém está te espionando", "Todos veem as mesmas propagandas"], correctAnswer: "IA usa seus dados para mostrar anúncios relevantes", explanation: "A IA analisa suas buscas, navegação e interações para mostrar anúncios de produtos que podem interessar você." },
            { question: "O que acontece quando você curte muitos posts sobre um assunto?", options: ["Nada muda", "IA entende seu interesse e mostra mais conteúdo similar", "Sua conta é bloqueada", "Você para de ver outros assuntos"], correctAnswer: "IA entende seu interesse e mostra mais conteúdo similar", explanation: "A IA interpreta suas curtidas como sinal de interesse e passa a mostrar mais conteúdo relacionado a esse tema." },
            { question: "Como a IA pode ajudar estudantes?", options: ["Fazendo provas por eles", "Oferecendo tutoria personalizada e esclarecendo dúvidas", "Substituindo professores", "Apenas corrigindo textos"], correctAnswer: "Oferecendo tutoria personalizada e esclarecendo dúvidas", explanation: "A IA pode atuar como tutor virtual, adaptando-se ao ritmo de cada aluno e oferecendo explicações personalizadas." },
            { question: "O que é importante ao usar IA para criar um conteúdo?", options: ["Copiar tudo que ela escreve", "Usar como apoio, mas sempre verificar e aprender", "Só usar para assuntos que não conhece", "Só usar para fazer contas"], correctAnswer: "Usar como apoio, mas sempre verificar e aprender", explanation: "A IA deve ser uma ferramenta de apoio ao aprendizado, não um substituto do pensamento crítico e da pesquisa própria." },
            { question: "A IA pode cometer erros?", options: ["Nunca", "Sim, por isso é importante verificar informações", "Apenas em cálculos", "Só quando não tem internet"], correctAnswer: "Sim, por isso é importante verificar informações", explanation: "A IA não é infalível e pode fornecer informações incorretas ou tendenciosas, por isso sempre verificar fontes é importante." },
            { question: "O que você deve fazer antes de confiar numa resposta do ChatGPT?", options: ["Aceitar sempre como verdade", "Verificar a informação em outras fontes", "Compartilhar imediatamente", "Nunca usar para nada"], correctAnswer: "Verificar a informação em outras fontes", explanation: "Mesmo sendo útil, o ChatGPT pode cometer erros, então é importante verificar informações importantes em outras fontes." },
            { question: "Por que é importante dar prompts claros para a IA?", options: ["Para ela não quebrar", "Para obter respostas mais precisas e úteis", "Porque ela fica brava", "Para economizar energia"], correctAnswer: "Para obter respostas mais precisas e úteis", explanation: "Prompts claros e específicos ajudam a IA a entender melhor o que você quer e fornecer respostas mais adequadas." },
            { question: "O que são 'dados de treinamento' para uma IA?", options: ["Instruções de uso", "Informações usadas para ensinar a IA", "Memória do computador", "Códigos de programação"], correctAnswer: "Informações usadas para ensinar a IA", explanation: "Dados de treinamento são como exemplos que a IA estuda para aprender padrões e fazer previsões." },
            { question: "Por que a IA precisa de muitos dados para funcionar bem?", options: ["Para ocupar espaço", "Mais dados ajudam a encontrar padrões mais precisos", "Para impressionar usuários", "Dados não são importantes"], correctAnswer: "Mais dados ajudam a encontrar padrões mais precisos", explanation: "Com mais exemplos, a IA pode identificar padrões com maior precisão e fazer melhores previsões." },
            { question: "Como a IA 'entende' imagens?", options: ["Vê como humanos", "Analisa padrões de pixels e cores", "Adivinha o conteúdo", "Não consegue entender imagens"], correctAnswer: "Analisa padrões de pixels e cores", explanation: "A IA não 'vê' como humanos, mas identifica padrões matemáticos nos pixels para reconhecer objetos." },
        ]
    },
    {
        level: 4,
        title: "Técnicas Avançadas",
        questions: [
            { question: "O que são 'filtros inteligentes' de redes sociais?", options: ["Filtros caros", "IA que reconhece faces e adiciona efeitos", "Filtros de água", "Apenas para influenciadores"], correctAnswer: "IA que reconhece faces e adiciona efeitos", explanation: "Filtros do Instagram e Snapchat usam IA para detectar rostos e aplicar efeitos em tempo real." },
            { question: "O que é mais importante ao interagir com IA?", options: ["Ser educado com ela", "Pensamento crítico sobre as respostas", "Usar linguagem técnica", "Fazer perguntas difíceis"], correctAnswer: "Pensamento crítico sobre as respostas", explanation: "Sempre questionar e verificar informações da IA é fundamental, pois ela pode cometer erros ou ter informações desatualizadas." },
            { question: "Como a IA pode ser uma ferramenta de aprendizado?", options: ["Fazendo trabalhos por você", "Explicando conceitos de formas diferentes", "Substituindo professores", "Dando respostas prontas"], correctAnswer: "Explicando conceitos de formas diferentes", explanation: "IA pode ser excelente tutora, explicando temas de várias maneiras até você entender, adaptando-se ao seu ritmo de aprendizado." },
            { question: "Qual atitude é importante ter com a IA?", options: ["Medo total", "Curiosidade responsável e uso ético", "Confiança cega", "Indiferença"], correctAnswer: "Curiosidade responsável e uso ético", explanation: "É importante ter curiosidade para aprender sobre IA, mas sempre usar de forma responsável e ética." },
            { question: "O que define uma IA como 'inteligente'?", options: ["Ter consciência", "Capacidade de aprender padrões e resolver problemas", "Ser igual aos humanos", "Nunca cometer erros"], correctAnswer: "Capacidade de aprender padrões e resolver problemas", explanation: "Inteligência artificial é definida pela capacidade de aprender com dados e resolver problemas específicos, não por ter consciência humana." },
            { question: "O que é um algoritmo de IA?", options: ["Um tipo de vírus de computador", "Um conjunto de regras para resolver problemas", "Uma linguagem de programação", "Um aplicativo do celular"], correctAnswer: "Um conjunto de regras para resolver problemas", explanation: "Algoritmos são como receitas que a IA segue para processar informações e tomar decisões." },
            { question: "O que acontece quando uma IA é treinada com dados ruins?", options: ["Funciona normalmente", "Pode aprender padrões incorretos ou preconceitos", "Para de funcionar", "Fica mais inteligente"], correctAnswer: "Pode aprender padrões incorretos ou preconceitos", explanation: "IA aprende dos dados fornecidos, então dados incorretos ou tendenciosos resultam em respostas problemáticas." },
            { question: "O que são 'redes neurais' na IA?", options: ["Cabos de internet", "Sistemas inspirados no cérebro humano", "Redes sociais para IA", "Conexões entre computadores"], correctAnswer: "Sistemas inspirados no cérebro humano", explanation: "Redes neurais artificiais imitam conexões do cérebro, processando informações através de nós interconectados." },
            { question: "O que é 'viés' em IA?", options: ["Um tipo de vírus", "Quando a IA reproduz preconceitos dos dados de treinamento", "Uma falha técnica", "Um erro de programação"], correctAnswer: "Quando a IA reproduz preconceitos dos dados de treinamento", explanation: "Viés acontece quando a IA aprende preconceitos presentes nos dados usados para treiná-la, reproduzindo discriminações." },
            { question: "A IA pode substituir completamente os professores e mentores?", options: ["Sim, é mais eficiente", "Não, falta interação humana e empatia", "Apenas em algumas matérias", "Só no ensino a distância"], correctAnswer: "Não, falta interação humana e empatia", explanation: "A IA pode apoiar a educação, mas professores trazem experiência humana, empatia e orientação que máquinas não conseguem replicar." },
        ]
    },
    {
        level: 5,
        title: "Mestria em Prompting: Casos Práticos",
        questions: [
            { question: "O que é importante saber sobre privacidade e IA?", options: ["IA nunca usa dados pessoais", "Devemos entender como nossos dados são usados", "Privacidade não importa", "Apenas adultos precisam se preocupar"], correctAnswer: "Devemos entender como nossos dados são usados", explanation: "É fundamental entender que dados são coletados e como são usados para treinar IAs e personalizar serviços." },
            { question: "O que diferencia IA Generativa de outras IAs?", options: ["É mais inteligente", "Cria conteúdo novo em vez de apenas analisar", "Funciona sem internet", "É mais barata"], correctAnswer: "Cria conteúdo novo em vez de apenas analisar", explanation: "IA Generativa pode criar textos, imagens ou música originais, não apenas analisar ou classificar informações existentes." },
            { question: "Qual é a limitação da criatividade da IA?", options: ["Não tem limitações", "Baseia-se em padrões existentes, não tem experiências humanas", "Só cria coisas simples", "Precisa sempre de internet"], correctAnswer: "Baseia-se em padrões existentes, não tem experiências humanas", explanation: "IA cria baseada no que aprendeu, mas não tem experiências pessoais ou emoções que inspiram criatividade humana." },
            { question: "A IA pode criar música?", options: ["Não, só humanos são criativos", "Sim, pode compor músicas baseada em padrões", "Apenas cópias de músicas existentes", "Só música eletrônica"], correctAnswer: "Sim, pode compor músicas baseada em padrões", explanation: "IA pode analisar milhões de músicas e criar composições originais seguindo estilos e padrões musicais." },
            { question: "Como IA pode ajudar artistas?", options: ["Substituindo todos os artistas", "Oferecendo ferramentas criativas e inspiração", "Apenas criticando trabalhos", "Só para arte digital"], correctAnswer: "Oferecendo ferramentas criativas e inspiração", explanation: "IA pode ser ferramenta criativa, ajudando artistas com ideias, variações e técnicas, mas não substituindo a criatividade humana." },
            { question: "O que é IA de criação de imagens?", options: ["Editor de fotos comum", "IA que cria imagens a partir de descrições de texto", "Aplicativo de desenho", "Rede social de imagens"], correctAnswer: "IA que cria imagens a partir de descrições de texto", explanation: "Essas IAs podem gerar imagens completamente novas baseadas em descrições textuais detalhadas." },
            { question: "A IA pode escrever poesias?", options: ["Não, falta sentimento", "Sim, baseada em padrões de textos poéticos", "Apenas traduzir poesias", "Só rimas simples"], correctAnswer: "Sim, baseada em padrões de textos poéticos", explanation: "IA pode gerar poesias aprendendo padrões de ritmo, métrica e estilo de grandes coleções de poemas." },
            { question: "O que é 'processamento de linguagem natural'?", options: ["Traduzir idiomas", "IA que entende e processa texto humano", "Corrigir erros de português", "Falar em voz alta"], correctAnswer: "IA que entende e processa texto humano", explanation: "É a capacidade da IA de compreender, interpretar e gerar linguagem humana de forma natural." },
            { question: "O que significa 'visão computacional'?", options: ["IA que tem olhos", "IA que analisa e entende imagens", "Câmeras de computador", "Óculos inteligentes"], correctAnswer: "IA que analisa e entende imagens", explanation: "Visão computacional permite que IA identifique objetos, pessoas e situações em imagens e vídeos." },
            { question: "O que é 'aprendizado supervisionado'?", options: ["IA que tem professor", "IA treinada com dados que têm respostas corretas", "IA que sempre acerta", "IA que funciona sozinha"], correctAnswer: "IA treinada com dados que têm respostas corretas", explanation: "É como ensinar a IA mostrando exemplos com as respostas certas, para que ela aprenda o padrão." },
        ]
    }
];

const POINTS_PER_QUESTION = 5;
const TOTAL_QUESTIONS_IN_QUIZ = 20;

const knowledgeLevels = [
  { level: 1, name: 'Neófito', description: 'Aquele que mal começou a decifrar os símbolos primordiais e a teoria dos quatro elementos.' },
  { level: 2, name: 'Aprendiz', description: 'Um estudante que já realiza suas primeiras destilações e compreende a separação básica de substâncias em laboratório.' },
  { level: 3, name: 'Praticante', description: 'Alguém que já domina o princípio, conseguindo criar elixires menores e purificar metais com consistência.' },
  { level: 4, name: 'Adepto', description: 'Um iniciado que avançou com sucesso pelas fases, dominando transmutações complexas.' },
  { level: 5, name: 'Mestre', description: 'Aquele que compreende todos os segredos e criou a Pedra Filosofal.' },
];

const questionDistribution: { [key: number]: number[] } = {
  1: [8, 5, 4, 2, 1],
  2: [4, 8, 5, 2, 1],
  3: [2, 4, 8, 4, 2],
  4: [1, 2, 5, 8, 4],
  5: [1, 2, 4, 5, 8],
};

const finalRanks = [
  { score: 0, rank: 'Escriba de Prompts' },
  { score: 30, rank: 'Alquimista Aprendiz' },
  { score: 50, rank: 'Alquimista Oficial' },
  { score: 75, rank: 'Mestre Alquimista' },
  { score: 95, rank: 'Grão-Mestre Alquimista' },
];

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generatePersonalizedQuiz = (knowledgeLevel: number): PersonalizedQuestion[] => {
    const distribution = questionDistribution[knowledgeLevel];
    let personalizedQuiz: PersonalizedQuestion[] = [];
    distribution.forEach((count, index) => {
        const level = index + 1;
        const questionsFromLevel = quizData.find(data => data.level === level)?.questions || [];
        const shuffledQuestions = shuffleArray(questionsFromLevel);
        const selectedQuestions = shuffledQuestions.slice(0, count).map(q => ({ ...q, originalLevel: level }));
        personalizedQuiz = [...personalizedQuiz, ...selectedQuestions];
    });
    return shuffleArray(personalizedQuiz);
};

const ProgressBar: FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <motion.div
        className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

const QuizCard: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-amber-900/20 p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );

// --- FIM DA ZONA SEGURA ---

// --- COMPONENTE PRINCIPAL ---
export default function PromptAlchemistQuiz() {
  const [quizPhase, setQuizPhase] = useState<'welcome' | 'selfAssessment' | 'playing' | 'results'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [selfAssessedLevel, setSelfAssessedLevel] = useState<number>(0);
  const [personalizedQuiz, setPersonalizedQuiz] = useState<PersonalizedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersByLevel, setCorrectAnswersByLevel] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const shuffledOptions = useMemo(() => {
    if (personalizedQuiz.length > 0 && personalizedQuiz[currentQuestionIndex]) {
      return shuffleArray(personalizedQuiz[currentQuestionIndex].options);
    }
    return [];
  }, [personalizedQuiz, currentQuestionIndex]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) setQuizPhase('selfAssessment');
  };

  const handleLevelSelect = (level: number) => {
    setSelfAssessedLevel(level);
    const quiz = generatePersonalizedQuiz(level);
    setPersonalizedQuiz(quiz);
    setQuizPhase('playing');
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    const currentQuestion = personalizedQuiz[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore(prev => prev + POINTS_PER_QUESTION);
      setCorrectAnswersByLevel(prev => ({
        ...prev,
        [currentQuestion.originalLevel]: prev[currentQuestion.originalLevel] + 1,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < personalizedQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setQuizPhase('results');
    }
  };

  const handleReset = () => {
    setQuizPhase('welcome');
    setPlayerName('');
    setSelfAssessedLevel(0);
    setPersonalizedQuiz([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersByLevel({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(null);
  };
  
  const finalResult = useMemo(() => {
    if (quizPhase !== 'results') return null;

    const rank = finalRanks.slice().reverse().find(r => score >= r.score) || finalRanks[0];
    
    let feedbackMessage = '';
    const distribution = questionDistribution[selfAssessedLevel];
    const totalQuestionsOfLevel = distribution[selfAssessedLevel - 1];
    const correctAnswersOfLevel = correctAnswersByLevel[selfAssessedLevel];

    const feedbackMatrix: Record<number, Record<string, string>> = {
        1: { superestimacao: "Com humildade, reconhecemos que até os primeiros passos são desafiadores. Parece que os símbolos primordiais ainda guardam segredos para você. A jornada do alquimista é feita de persistência. Estude os grimórios e tente novamente.", quaseLa: "Você já consegue ler os primeiros símbolos e entende a teoria dos elementos. Sua base está sendo construída, mas cuidado para não misturar os ingredientes errados. Continue praticando o básico para firmar seu conhecimento.", confirmacao: "Sua jornada começou com o pé direito! Você demonstrou ter uma base sólida e compreende os fundamentos da Grande Obra. O primeiro degrau foi conquistado com sucesso." },
        2: { superestimacao: "Suas primeiras destilações resultaram em fumaça e matéria impura. Você se declarou um Aprendiz, mas seu conhecimento prático ainda precisa de atenção. Volte ao laboratório, a teoria precisa de mais experimentos.", quaseLa: "Você já consegue separar substâncias, mas suas mãos ainda tremem. Um erro na destilação pode colocar tudo a perder. Seu potencial é claro, mas a disciplina no laboratório é o que diferencia o aprendiz do mestre.", confirmacao: "O cheiro de enxofre e mercúrio não te assusta mais! Você provou que seu lugar é no laboratório, realizando as primeiras transmutações com a confiança de um verdadeiro Aprendiz." },
        3: { superestimacao: "Você tentou criar um elixir da cura e produziu apenas uma poção turva. Declarar-se um Praticante exige consistência, e seus resultados mostraram que a sorte não estava ao seu lado. Seus elixires ainda são instáveis.", quaseLa: "Seus elixires funcionam, mas os efeitos são imprevisíveis. Purificar metais exige foco absoluto, e um lapso pode levar a uma pequena explosão. Você está no caminho, mas a maestria exige controle total do processo.", confirmacao: "Com habilidade e precisão, você purificou os metais e criou elixires estáveis. Seu título de Praticante é justo e merecido. O domínio dos princípios alquímicos é evidente em seu trabalho." },
        4: { superestimacao: "A transmutação complexa que você tentou resultou em chumbo, não em ouro. Foi um Ouro de Tolo. Você se declarou um Adepto, mas as fases superiores da alquimia ainda são um enigma para você. A arrogância é o maior inimigo do conhecimento.", quaseLa: "Você abriu um vislumbre do outro lado, mas o portal que criou é instável. Um conhecimento incompleto em transmutações avançadas é perigoso, podendo romper o véu entre as dimensões. A Grande Obra exige perfeição, não pressa.", confirmacao: "Com sucesso, você navegou pelas fases mais complexas da alquimia. As transmutações avançadas obedecem ao seu comando. Você é, sem dúvida, um Adepto, um verdadeiro iniciado nos grandes mistérios." },
        5: { superestimacao: "Você se proclamou um Mestre, mas seus resultados revelaram que a Pedra Filosofal é apenas uma miragem em suas mãos. Você produziu Ouro de Tolo. A verdade da alquimia é humilde, e seu conhecimento precisa ser temperado no fogo da prática.", quaseLa: "Você tentou criar a Pedra Filosofal, mas o que obteve foi um catalisador poderoso e instável. Com esse conhecimento parcial, você pode abrir um portal multidimensional perigoso. O poder que você busca exige responsabilidade e domínio absoluto.", confirmacao: "O brilho em suas mãos não deixa dúvidas. A Pedra Filosofal é real. Você compreende todos os segredos da matéria e do espírito. Certamente, você está entre os maiores Alquimistas que já existiram." }
    };

    if (selfAssessedLevel <= 2 && score >= 80) {
        feedbackMessage = "Você se apresentou como um mero aprendiz, mas seus resultados brilham com a sabedoria de um Mestre. A humildade é uma virtude, mas não se engane: um poder alquímico imenso reside em você.";
    } else {
        const successRate = totalQuestionsOfLevel > 0 ? correctAnswersOfLevel / totalQuestionsOfLevel : 0;
        
        if (successRate < 0.3) {
            feedbackMessage = feedbackMatrix[selfAssessedLevel].superestimacao;
        } else if (successRate < 1) {
            feedbackMessage = feedbackMatrix[selfAssessedLevel].quaseLa;
        } else {
            feedbackMessage = feedbackMatrix[selfAssessedLevel].confirmacao;
        }
    }

    return { rank: rank.rank, feedbackMessage };
  }, [quizPhase, score, selfAssessedLevel, correctAnswersByLevel]);

  const renderPhase = () => {
    switch (quizPhase) {
      case 'welcome':
        return (
          <QuizCard key="welcome">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-100">Bem-vindo à Forja Alquímica!</h2>
              <p className="text-slate-400 mt-2 mb-8">Como deseja ser chamado(a), aprendiz?</p>
              <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Seu nome de alquimista"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
                <button type="submit" className="mt-4 px-8 py-3 font-semibold text-slate-900 bg-amber-400 rounded-lg shadow-md hover:bg-amber-300 transition-colors flex items-center gap-2 mx-auto disabled:bg-slate-600" disabled={!playerName.trim()}>
                  Próximo <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </QuizCard>
        );

      case 'selfAssessment':
        return (
          <QuizCard key="selfAssessment">
            <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Autoavaliação</h2>
            <p className="text-slate-400 text-center mb-6">Você considera seu conhecimento na alquimia da IA:</p>
            <div className="space-y-3">
              {knowledgeLevels.map(level => (
                <button key={level.level} onClick={() => handleLevelSelect(level.level)} className="w-full text-left p-4 rounded-lg border-2 border-slate-600 hover:bg-slate-700 hover:border-amber-400 transition-all duration-200">
                  <p className="font-bold text-amber-400">{level.name}</p>
                  <p className="text-sm text-slate-300">{level.description}</p>
                </button>
              ))}
            </div>
          </QuizCard>
        );

      case 'playing':
        if (!personalizedQuiz[currentQuestionIndex]) {
          return <QuizCard><div className="text-center">Carregando quiz...</div></QuizCard>;
        }
        const currentQuestion = personalizedQuiz[currentQuestionIndex];
        return (
          <QuizCard key="playing">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="font-semibold text-amber-400">Desafio Alquímico</span>
                <span className="text-slate-400">Pontuação: {score}</span>
              </div>
              <ProgressBar value={currentQuestionIndex + 1} max={personalizedQuiz.length} />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-slate-100">{`[${currentQuestionIndex + 1}/${personalizedQuiz.length}] ${currentQuestion.question}`}</h2>
            <div className="space-y-3">
              {shuffledOptions.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                let buttonClass = 'border-slate-600 hover:bg-slate-700 hover:border-amber-400';
                if (isAnswered) {
                    if (isCorrectOption) buttonClass = 'bg-green-500/20 border-green-500 text-white cursor-default';
                    else if (isSelected && !isCorrect) buttonClass = 'bg-red-500/20 border-red-500 text-white cursor-default';
                    else buttonClass = 'border-slate-700 text-slate-400 cursor-default';
                } else if (isSelected) {
                    buttonClass = 'bg-amber-500/20 border-amber-500';
                }
                return (
                  <button key={option} onClick={() => setSelectedAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${buttonClass}`}>
                    <span>{option}</span>
                    {isAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <h3 className={`font-bold text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Correto!' : 'Incorreto'}</h3>
                <p className="text-slate-300 mt-1">{currentQuestion.explanation}</p>
              </motion.div>
            )}
            <div className="mt-8 text-right">
              {!isAnswered ? (
                <button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="px-6 py-2 font-semibold text-slate-900 bg-amber-400 rounded-lg shadow-md hover:bg-amber-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                  Verificar
                </button>
              ) : (
                <button onClick={handleNextQuestion} className="px-6 py-2 font-semibold text-slate-900 bg-amber-400 rounded-lg shadow-md hover:bg-amber-300 transition-colors flex items-center gap-2 ml-auto">
                  Avançar <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </QuizCard>
        );


      case 'results':
        return (
          <QuizCard key="results">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto text-amber-400 mb-4" />
              <h2 className="text-3xl font-bold text-slate-100">Resultado da Grande Obra</h2>
              <p className="text-slate-400 mt-2 mb-6">Veja o que sua alquimia produziu, {playerName}.</p>
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-sm uppercase">Pontuação Final</p>
                <p className="text-5xl font-bold text-white my-2">{score} / {TOTAL_QUESTIONS_IN_QUIZ * POINTS_PER_QUESTION}</p>
                <p className="text-slate-400 text-sm uppercase mt-4">Rank Alcançado</p>
                <p className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mt-1">{finalResult?.rank}</p>
              </div>
              <div className="mt-6 p-4 text-center bg-slate-900/50 rounded-lg border-2 border-amber-600/30">
                <h3 className="font-bold text-lg text-amber-300 mb-2">Veredito do Alquimista</h3>
                <p className="text-slate-200">{finalResult?.feedbackMessage}</p>
              </div>
              <div className="mt-8 flex justify-center">
                  <button onClick={handleReset} className="px-8 py-3 font-semibold text-slate-900 bg-amber-400 rounded-lg shadow-md hover:bg-amber-300 transition-colors flex items-center gap-2">
                    <RotateCw className="w-5 h-5" /> Tentar Novamente
                  </button>
              </div>
            </div>
          </QuizCard>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Quiz: O Alquimista de Prompts</title>
        <meta name="description" content="Descubra seu nível como Alquimista de Prompts de IA." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 flex items-center justify-center gap-x-3">
            <Sparkles className="w-8 h-8 text-amber-400" />
            O Alquimista de Prompts
          </h1>
          <p className="text-slate-400 mt-2">Refine prompts brutos em ouro. Suba de nível.</p>
        </div>
        <AnimatePresence mode="wait">
          {renderPhase()}
        </AnimatePresence>
      </main>
    </>
  );
}
