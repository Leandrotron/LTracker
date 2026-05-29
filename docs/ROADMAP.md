# ROADMAP

## LTracker Gym - Branch `gym-edition`

- Reposicionar a interface inicial como ficha de treino digital para academias locais.
- Organizar a experiencia em abas simples: Ficha, Historico e Perfil.
- Separar ambiente do aluno (`index.html`) e Admin local (`admin.html`).
- Criar biblioteca local de programas no Admin e aplicar copias independentes na ficha do aluno.
- Priorizar aluno atual, ficha A/B/C, exercicios em ordem, fotos, observacoes e acao de marcar treino feito.
- Transformar exercicios da ficha em itens de execucao com conclusao individual e progresso simples.
- Transformar Historico em linha do tempo de acompanhamento do aluno, sem metricas pessoais antigas.
- Manter registro simples por data com multiplas entradas: treino, caminhada, corrida, bike, descanso, doente, outro e observacao.
- Esconder da experiencia inicial os elementos pessoais do LTracker original, como sono, peso e dashboard amplo.
- Permitir cardio simples como registro complementar do dia, sem transformar a experiencia em painel de metricas.
- Continuar sem backend, Supabase ou gestao completa de academia no MVP.

## Milestone 1: Base visual

- Estrutura inicial do projeto.
- Layout dark mode minimalista.
- Area "Hoje" com cards principais.

## Milestone 2: Registro diario

- Campos simples para sono, energia e recuperacao.
- Status neutro do dia para ativo, descanso planejado, recuperacao ou doente.
- Salvamento em localStorage.
- Edicao do registro do dia atual.

## Milestone 3: Atividades

- Cadastro rapido de atividade.
- Campo Data no registro para adicionar ou corrigir atividades de dias anteriores.
- Historico em timeline agrupada por data, mostrando todas as entradas de cada dia.
- Tipos atuais: Treino, Caminhada, Corrida, Bike, Descanso, Doente e Outro.
- Campos simples para cardio: duracao, distancia opcional, intensidade opcional e observacao.
- Edicao e remocao simples de registros incorretos.

## Milestone 4: Resumo semanal

- Leitura da semana atual.
- Totais e medias simples.
- Resumo da semana atual com corridas, academia, distancias, sono e peso.
- Sem graficos na primeira versao.

## Milestone 5: Acabamento do MVP

- Ajustes responsivos.
- Revisao de textos e estados vazios.
- Preparacao para uso via GitHub Pages.
- Backup manual por exportacao/importacao de JSON do `localStorage`.
- Pequenas melhorias de usabilidade.

## Milestone 6: Academia interna

- Secao "Academia" dentro do LTracker existente.
- Ficha simples de treino com exercicios por Treino A e Treino B.
- Ficha inicial baseada no treino real do usuario, sem sobrescrever exercicios ja cadastrados.
- Ficha recolhivel para manter a tela principal mais limpa.
- Modo simples para adicionar, remover e reorganizar exercicios dos templates A/B.
- Detalhes opcionais por exercicio: carga/peso, observacoes e foto do equipamento.
- Persistencia da ficha no mesmo localStorage do app.
- Sem progressao avancada, calendario, graficos ou drag and drop nesta etapa.
