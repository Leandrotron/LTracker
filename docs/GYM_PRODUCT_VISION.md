# LTracker Gym - Visao do Produto

## Objetivo do produto

O LTracker Gym sera uma ficha de treino digital simples para academias locais.

O objetivo inicial e substituir fichas em papel, mensagens soltas e planilhas improvisadas por uma experiencia leve, facil de manter e focada no aluno: consultar o treino, entender a ordem dos exercicios, reconhecer aparelhos por foto, registrar que treinou e manter um historico basico.

## Publico-alvo

- Academias locais de pequeno e medio porte.
- Personal trainers e professores que montam treinos para alunos recorrentes.
- Alunos que precisam consultar a propria ficha no celular durante o treino.
- Operacoes que querem digitalizar a ficha sem adotar um sistema completo de gestao.

## Problema que resolve

Muitas academias ainda dependem de ficha impressa, quadro, foto no WhatsApp ou planilha. Isso dificulta atualizacoes, confunde alunos novos, perde historico e deixa detalhes importantes espalhados.

O LTracker Gym resolve primeiro o problema mais concreto: a ficha de treino do aluno precisa estar clara, acessivel e atualizada.

## Filosofia do produto

- Simples antes de completo.
- Ficha de treino como centro do produto.
- Poucas telas, poucos conceitos e baixa curva de aprendizado.
- Visual pratico para uso na academia, inclusive no celular.
- Dados uteis para aluno e professor, sem transformar o app em rede social.
- Evoluir a partir do uso real de academias locais, nao a partir de um sistema generico de fitness.

## MVP inicial

O MVP deve entregar uma ficha de treino digital funcional:

- Treinos A/B/C ou nomes personalizados.
- Exercicios em ordem dentro de cada treino.
- Foto opcional do aparelho ou exercicio.
- Observacoes por exercicio.
- Marcar treino como feito.
- Historico simples de treinos realizados.
- Status do dia como descanso, recuperacao ou doente.
- Persistencia simples no navegador enquanto a arquitetura final nao for definida.
- Exportacao/importacao de dados enquanto nao houver backend.

## O que nao entra no MVP

- Rede social.
- Ranking entre alunos.
- Analytics avancado.
- IA.
- Gamificacao pesada.
- Financeiro da academia.
- Sistema completo de gestao da academia.
- App fitness generico com dieta, desafios, comunidade ou marketplace.
- Controle detalhado de alunos, contratos, pagamentos e check-in.

## Diferenca entre LTracker pessoal e LTracker Gym

O LTracker pessoal e um diario individual de treino, sono, peso, atividades e resumo semanal, pensado para uso proprio em um navegador.

O LTracker Gym sera orientado a uma relacao academia-professor-aluno. O centro deixa de ser o diario pessoal amplo e passa a ser a ficha de treino: o aluno precisa saber o que fazer, em qual ordem, com quais observacoes, e registrar que concluiu o treino.

Na pratica:

- LTracker pessoal acompanha rotina e metricas pessoais.
- LTracker Gym organiza execucao de treino em academia.
- LTracker pessoal pode continuar simples e privado.
- LTracker Gym deve crescer pensando em multiplos alunos, professores e fichas, mesmo que o MVP ainda nao tenha backend.

## Roadmap inicial

### Fase 1 - Conceito e recorte

- Documentar visao do produto.
- Definir o escopo do MVP.
- Separar claramente o que pertence ao LTracker pessoal e ao LTracker Gym.

### Fase 2 - Ficha de treino

- Reorganizar a interface em torno da ficha.
- Permitir treinos A/B/C e nomes personalizados.
- Permitir exercicios ordenados.
- Manter fotos e observacoes por exercicio.

### Fase 3 - Execucao do treino

- Permitir marcar treino como feito.
- Registrar data, treino realizado e status do dia.
- Exibir historico simples.

### Fase 4 - Preparacao para uso em academia

- Revisar textos e fluxo para aluno/professor.
- Melhorar leitura em celular.
- Avaliar necessidade de perfis, compartilhamento e sincronizacao.

### Fase 5 - Decisao de arquitetura

- Decidir se o produto continua local-first por mais tempo.
- Avaliar backend apenas quando houver necessidade real de multiplos usuarios, sincronizacao ou administracao por academia.
