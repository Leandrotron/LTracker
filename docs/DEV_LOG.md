# DEV_LOG

## 2026-05-29

- Formulario de registro passa a ter campo Data editavel, preenchido por padrao com hoje.
- Salvamento de atividades deixa de depender apenas do dia atual e usa a data selecionada para gravar em `days[YYYY-MM-DD].entries`.
- Timeline do Historico passa a agrupar registros por data, exibindo todos os itens daquele dia sob a mesma data.
- Edicao de registro permite alterar tambem a data, movendo a entrada entre dias quando necessario.
- Conclusao de exercicios da ficha passa a respeitar a data selecionada no formulario.
- Registro diario evoluido para `entries`, permitindo multiplos registros no mesmo dia.
- O formulario principal agora adiciona novas entradas sem sobrescrever caminhada, corrida, bike, treino, descanso, doente ou outro ja salvos no dia.
- Historico passa a exibir todas as entradas de cada dia em timeline, com acoes simples de editar e remover.
- Edicao de entrada reaproveita o formulario da aba Ficha, com salvar alteracoes e cancelar.
- Conclusao de exercicios passa a ser salva em `completedExercises` dentro da entrada `gym` correspondente.
- Adicionada migracao local basica de `activities`, `dayStatus`, `statusNote`, `workoutPlan` e `completedExercises` antigos para o modelo novo.
- Reintroduzido o registro manual de atividades nao-academia na aba Ficha sem voltar ao dashboard antigo.
- O card "Registro do dia" passa a aceitar Treino, Caminhada, Corrida, Bike, Descanso, Doente e Outro.
- Caminhada, Corrida e Bike exibem duracao, distancia opcional, intensidade opcional e observacao opcional.
- Descanso e Doente salvam o status do dia com observacao opcional e atualizam imediatamente a linha do tempo.
- Treinos continuam usando a ficha atual, o seletor A/B/C e a conclusao individual de exercicios.
- Historico continua em formato de timeline e passa a listar treinos, cardio, descanso/doente, outro e observacoes.
- Removido da aba Ficha o card duplicado de status rapido para manter a experiencia minimalista e mobile-first.

## 2026-05-25

- Corrigida a adicao de multiplos exercicios em treinos internos de programas no Admin.
- Mutacoes do editor de programa passam a re-renderizar tambem o detalhe selecionado, preservando inputs/listeners apos cada alteracao.
- Admin reorganizado em tres secoes claras: Alunos, Programas e Detalhe selecionado.
- Formulario de novo aluno, lista de programas e editor de programa deixam de competir na mesma area visual.
- Editor de treinos internos so aparece quando um programa e aberto; aplicacao de programa so aparece quando um aluno e aberto.
- Conceito de templates evoluido para Programas de treino, com treinos internos A/B/C.
- Admin passa a criar programas, adicionar treinos internos e editar exercicios dentro de cada treino do programa.
- App do aluno passa a renderizar os seletores de treino a partir dos treinos internos do programa atual.
- Ao aplicar um programa ao aluno, o app copia todos os treinos A/B/C para `student.currentProgram` e `student.workoutTemplates`.
- Ajustado o fluxo do Admin: criacao de aluno nao aplica programas automaticamente.
- Lista de alunos passa a abrir detalhes do aluno selecionado, com dados, resumo da ficha atual e aplicacao de programa no contexto do aluno.
- Aplicacao de programa continua copiando exercicios para a ficha individual, preservando independencia em relacao ao programa base.
- Admin local ganha biblioteca inicial de programas de treino em `admin.html`.
- Programas locais permitem nome, observacao, treinos A/B/C, exercicios editaveis, reordenacao, remocao, carga sugerida, grupo muscular, observacao e foto opcional.
- Admin permite aplicar um programa ao aluno atual copiando os treinos para `student.workoutTemplates`, sem referencia dinamica ao programa original.
- Admin local foi separado da interface do aluno: `index.html` fica para o aluno e `admin.html` para professor/academia.
- `app.js` passa a inicializar apenas os blocos presentes na pagina atual, permitindo compartilhar logica e `localStorage` entre aluno e Admin.
- Criada aba Admin local inicial na branch `gym-edition`, ainda sem backend/login.
- Admin permite cadastrar alunos com nome, data de inicio e observacao opcional em `localStorage`.
- Lista de alunos permite selecionar o aluno atual e manter a selecao apos recarregar a pagina.
- Nome do aluno atual passa a aparecer no topo do app e continua salvo no mesmo backup JSON.
- Adicionado `docs/GYM_ADMIN_FLOW.md` com a especificacao inicial do modulo Admin do LTracker Gym.
- Admin definido como ferramenta simples para criar alunos, copiar programas para fichas individuais, editar fichas e acompanhar timeline do aluno.
- Aba Historico da branch `gym-edition` foi reformulada como linha do tempo de acompanhamento do aluno.
- Removidas da interface de Historico as metricas pessoais antigas, como km, sono e peso.
- Adicionado resumo compacto com treinos concluidos, ultimo treino, sequencia recente e treino ativo.
- Adicionada area simples de aviso/recomendacao local para revisao de ficha ou retorno ao treino.
- Corrigida a renderizacao da ficha para usar um unico treino ativo (`activeWorkout`) por vez.
- Removida a renderizacao simultanea dos containers A/B na ficha; agora apenas `workoutTemplates[activeWorkout]` e exibido.
- Ficha da branch `gym-edition` passa a funcionar como fluxo de execucao, com exercicios interativos e conclusao individual.
- Conclusao de exercicios do treino selecionado e salva no dia atual em `completedExercises` dentro de `ltracker.data`.
- Itens de exercicio passam a destacar numero, nome, carga, chip muscular, indicacao de foto e estado concluido discreto.
- Progresso do treino selecionado passa a mostrar quantos exercicios foram concluidos no dia.
- Troca entre Treino A/B preserva o estado de execucao salvo localmente e mostra apenas o treino ativo.
- Interface da branch `gym-edition` reorganizada em abas simples: Ficha, Historico e Perfil.
- Aba Ficha concentra treino selecionado, exercicios, status simples e acao de marcar treino feito.
- Aba Historico passa a guardar os ultimos registros e metricas simples ja existentes.
- Aba Perfil concentra aluno atual, modo editar ficha, exportacao/importacao e espaco para configuracoes futuras.
- Navegacao por abas usa apenas HTML, CSS e JavaScript puros, sem router ou framework.
- Interface inicial da branch `gym-edition` passa a usar foco visual/textual de LTracker Gym.
- Tela principal passa a priorizar ficha de treino digital, aluno atual, status do dia, marcar treino feito e historico simples.
- Elementos pessoais do LTracker original, como sono, peso, corrida, bike e dashboard pessoal, foram removidos da interface inicial sem apagar a logica interna.
- Ficha A/B segue editavel e recolhivel, com indicacao visual de espaco futuro para Treino C.
- Adicionado nome temporario/editavel do aluno salvo localmente no navegador.
- Criada a branch conceitual `gym-edition` para explorar o LTracker Gym separadamente do LTracker pessoal.
- Adicionado `docs/GYM_PRODUCT_VISION.md` com a visao inicial do produto focado em fichas de treino digitais para academias locais.
- Adicionados botoes "Exportar dados" e "Importar dados" para backup manual do conteudo salvo em `localStorage` na chave `ltracker.data`.
- Exportacao baixa um arquivo `.json` com o backup local atual.
- Importacao valida se o JSON parece um backup do LTracker, pede confirmacao antes de substituir os dados locais e re-renderiza a interface apos concluir.
- Atualizada a observacao discreta do app para orientar que os dados ficam neste navegador e que exportar/importar deve ser usado para backup.
- Mantida a ausencia de backend e preservado o schema atual.

## 2026-05-23

- Exercicios dos templates A/B passam de string para objeto com `name`, `weight`, `notes` e `photo`.
- Adicionada migracao automatica de exercicios antigos em string para o novo formato.
- Modo normal da ficha volta a exibir carga, observacoes e botao de camera quando houver foto.
- Modo editar ficha permite atualizar nome, carga, observacoes, foto e remover foto do exercicio.
- Adicionado modo simples de edicao dos templates A/B da ficha de academia.
- Templates A/B passam a ser persistidos em `workoutTemplates` dentro de `ltracker.data`.
- Modo edicao permite subir, descer, remover e adicionar exercicios por treino.
- Adicionada migracao simples de `gym.exercises` antigo para `workoutTemplates` quando necessario.
- Ficha de treino da Academia passa a iniciar recolhida e aparecer apenas quando o tipo da atividade for Academia.
- Adicionado controle "Ver ficha do treino" / "Ocultar ficha do treino" para abrir e fechar a ficha.
- Ficha exibida passa a acompanhar o Treino A/B selecionado no registro da atividade.
- Ficha de academia inicial passa a usar a ficha real do usuario: Treino A de superiores e Treino B de inferiores.
- A ficha inicial e inserida apenas quando ainda nao existem exercicios cadastrados, sem sobrescrever dados locais.
- Exercicios da ficha permitem ajuste posterior de carga, observacao e foto opcional direto na lista.
- Adicionada secao interna "Academia" ao app existente.
- Criada ficha de treino com cadastro simples de exercicios por Treino A ou B.
- Exercicios da ficha guardam ordem, nome, carga, series, repeticoes, observacao e foto opcional em data URL.
- Ficha de academia passa a ser salva em `gym.exercises` dentro da mesma chave `ltracker.data`.
- Exibicao da ficha agrupa exercicios por Treino A e Treino B, com miniatura apenas quando houver foto.
- Ajustados os campos de duracao e distancia das atividades para aceitar decimais livres com ponto ou virgula.
- Duracao de atividade passa a aceitar tambem `min:seg`, salvando em `duration` como minutos decimais normalizados.
- Lista de atividades passa a exibir duracao e distancia em formatos mais amigaveis, sem casas decimais desnecessarias.
- Totais semanais de km passam a preservar melhor distancias decimais.
- Ajustados os campos de peso e sono para aceitar entrada decimal com ponto ou virgula.
- Sono passa a aceitar tambem o formato `h:min`, salvando em `sleepHours` como decimal normalizado para manter compatibilidade.
- Resumo semanal passa a calcular sono com decimal, virgula ou `h:min` e exibir media em formato amigavel, como `7h02`.
- Peso medio semanal passa a considerar decimais com duas casas.
- Sensacao do treino passa a usar campo controlado em escala simples.

## 2026-05-22

- Adicionado tipo de atividade Caminhada ao formulario.
- Caminhada usa os mesmos campos de Corrida e Bike: distancia, duracao, intensidade percebida e observacoes.
- Resumo semanal passa a exibir km totais de caminhada.

## 2026-05-21

- Adicionado campo "Status do dia" ao registro diario com valores ativo, descanso planejado, recuperacao e doente.
- Adicionada nota opcional do status no registro diario.
- Status do dia passa a ser salvo em `dayStatus` e `statusNote` no objeto do dia atual.
- Resumo semanal passa a exibir dias ativos e dias de descanso/recuperacao/doente de forma neutra.

## 2026-05-20

- Preparado o projeto para uso via GitHub Pages mantendo dados apenas no localStorage do dispositivo.
- Atualizado README com orientacoes de uso local, GitHub Pages e limite de sincronizacao.
- Adicionada observacao discreta no app sobre armazenamento apenas neste dispositivo.
- Revisados pequenos espacamentos para uso mobile.
- Transformado o card "Resumo semanal" em metricas funcionais.
- Adicionado calculo da semana atual com base na data local, de segunda a domingo.
- Adicionados totais semanais de corridas, academia, km de corrida, km de bike, media de sono e peso medio.
- Resumo semanal passa a atualizar ao carregar, salvar o registro diario e adicionar atividade.
- Transformado o card "Atividades" em formulario funcional.
- Adicionados tipos iniciais Corrida, Bike e Academia.
- Adicionados campos especificos para distancia em Corrida/Bike e treino A/B com sensacao em Academia.
- Implementado salvamento e listagem das atividades do dia atual em localStorage.
- Transformado o card "Registro diario" em formulario funcional.
- Adicionados campos de peso, sono, qualidade do sono, disposicao, dores e observacoes.
- Implementado salvamento do dia atual com localStorage.
- Implementado carregamento automatico dos dados do dia atual ao abrir a pagina.
- Criada a estrutura inicial do projeto.
- Adicionado layout base em dark mode.
- Criada a area principal "Hoje".
- Criados cards vazios para registro diario, atividades e resumo semanal.

## Decisoes iniciais

- MVP com HTML, CSS e JavaScript puro.
- Persistencia futura via localStorage.
- Sem backend, frameworks, build tools ou bibliotecas externas.
- Estrutura simples para evitar abstracoes prematuras.
