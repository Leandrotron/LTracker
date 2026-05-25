# DEV_LOG

## 2026-05-25

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
