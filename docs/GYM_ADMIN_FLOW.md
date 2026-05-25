# LTracker Gym - Fluxo Admin

## Objetivo do Admin

O Admin do LTracker Gym sera uma ferramenta simples para professor ou academia criar, editar e acompanhar fichas de treino.

O foco inicial e operacional: manter alunos, montar fichas a partir de programas da academia, ajustar detalhes individuais e acompanhar se o aluno esta treinando, descansando ou doente.

## O que o Admin nao e

- Nao e ERP.
- Nao e sistema financeiro.
- Nao e catraca.
- Nao e CRM completo.
- Nao e sistema completo de gestao de academia.
- Nao substitui ferramentas administrativas da academia.

## Telas previstas no MVP

- Lista de alunos.
- Perfil do aluno.
- Biblioteca de programas.
- Editor de ficha.
- Historico/timeline do aluno.

## Admin local inicial

A primeira versao do Admin roda em `admin.html`, apenas no navegador, usando `localStorage`.

Ela existe para validar o fluxo basico antes de backend, login, permissoes ou sincronizacao online.

Escopo desta etapa:

- Listar alunos cadastrados.
- Criar novo aluno com nome, data de inicio e observacao opcional.
- Selecionar um aluno como aluno atual.
- Abrir detalhes do aluno selecionado.
- Manter a selecao do aluno atual apos recarregar a pagina.
- Atualizar o nome exibido no app a partir do aluno selecionado.
- Criar programas locais de treino.
- Editar exercicios dentro dos treinos A/B/C de cada programa.
- Aplicar um programa dentro dos detalhes do aluno atual copiando seus treinos para a ficha individual.

Separacao de ambientes:

- `index.html` e o ambiente do aluno.
- `admin.html` e o ambiente do professor/academia.
- Ambos podem compartilhar `app.js` e a chave `ltracker.data` enquanto o produto ainda e local.

## Organizacao visual do Admin local

O Admin local fica organizado em tres secoes:

- Alunos: lista de alunos e formulario simples de novo aluno.
- Programas: lista de programas e formulario simples de novo programa.
- Detalhe selecionado: mostra o aluno ou programa aberto no momento.

Regras de exibicao:

- O editor de programa aparece apenas quando um programa e aberto.
- A aplicacao de programa aparece apenas quando um aluno e aberto.
- O formulario de novo aluno nao fica misturado com o editor de programa.
- O formulario de novo programa nao fica misturado com o detalhe do aluno.

Fora desta etapa:

- Programas por aluno.
- Login.
- Permissoes.
- Importacao por planilha.
- Sync online.

## Biblioteca local de programas

No Admin local, a biblioteca de programas fica em `gym.programLibrary`.

Cada programa possui:

- Nome.
- Observacao opcional.
- Treinos internos, como A, B, C ou outro texto curto.

Cada treino interno possui uma lista de exercicios.
O treino interno tambem pode ter um titulo opcional, como Superiores, Inferiores ou Full body.

Cada exercicio do programa pode ter:

- Nome.
- Grupo muscular.
- Carga sugerida.
- Observacao.
- Foto opcional.

Os exercicios podem ser adicionados, removidos e reordenados dentro de cada treino A/B/C.

Ao aplicar um programa em um aluno, o sistema copia os treinos A/B/C para `student.currentProgram` e `student.workoutTemplates`. A ficha do aluno passa a ser independente do programa base.

O fluxo correto e:

1. Criar o aluno apenas com nome, data de inicio e observacao opcional.
2. Selecionar o aluno na lista.
3. Abrir os detalhes do aluno.
4. Escolher um programa existente.
5. Aplicar o programa ao aluno.

Programas nao sao aplicados automaticamente no cadastro de aluno.

## Fluxo de novo aluno

1. Criar aluno.
2. Informar nome.
3. Informar data de inicio.
4. Adicionar observacao opcional.
5. Escolher um programa da academia.
6. Copiar o programa escolhido para a ficha individual do aluno.
7. Revisar a ficha individual antes de liberar para uso.

## Fluxo de edicao da ficha

O professor deve conseguir editar a ficha individual do aluno sem afetar outros alunos.

- Editar exercicios.
- Reordenar exercicios.
- Remover exercicios.
- Adicionar exercicios.
- Adicionar foto do aparelho ou exercicio.
- Adicionar observacao por exercicio.
- Alterar carga sugerida.

## Fluxo de acompanhamento

O Admin deve ajudar o professor a entender rapidamente a continuidade do aluno.

- Ver ultimo treino.
- Ver timeline do aluno.
- Ver quantidade de treinos concluidos.
- Ver registros de descanso ou doente.
- Ver observacoes rapidas do aluno.
- Exibir aviso de revisao apos X treinos.

## Conceito importante

Programas da academia sao uma base reutilizavel.

A ficha do aluno e uma copia editavel desses programas. Depois que a ficha e criada, ela pertence ao aluno.

Mudancas futuras no programa da academia nao alteram automaticamente fichas de alunos antigos. Isso evita sobrescrever adaptacoes individuais, cargas, observacoes e fotos especificas.

Se a academia quiser aplicar um programa atualizado em um aluno antigo, isso deve ser uma acao explicita de revisao ou substituicao da ficha.

## Futuro

- Importar alunos e fichas por planilha.
- Exportar historico do aluno.
- Sincronizar online com Supabase.
- Gerar link privado do aluno.
- Permitir multiplos professores por academia.
- Criar permissoes simples para professor e aluno.
