# LTracker Gym - Fluxo Admin

## Objetivo do Admin

O Admin do LTracker Gym sera uma ferramenta simples para professor ou academia criar, editar e acompanhar fichas de treino.

O foco inicial e operacional: manter alunos, montar fichas a partir de templates da academia, ajustar detalhes individuais e acompanhar se o aluno esta treinando, descansando ou doente.

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
- Biblioteca de templates.
- Editor de ficha.
- Historico/timeline do aluno.

## Fluxo de novo aluno

1. Criar aluno.
2. Informar nome.
3. Informar data de inicio.
4. Adicionar observacao opcional.
5. Escolher templates A/B/C da academia.
6. Copiar os templates escolhidos para a ficha individual do aluno.
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

Templates da academia sao uma base reutilizavel.

A ficha do aluno e uma copia editavel desses templates. Depois que a ficha e criada, ela pertence ao aluno.

Mudancas futuras no template da academia nao alteram automaticamente fichas de alunos antigos. Isso evita sobrescrever adaptacoes individuais, cargas, observacoes e fotos especificas.

Se a academia quiser aplicar um template atualizado em um aluno antigo, isso deve ser uma acao explicita de revisao ou substituicao da ficha.

## Futuro

- Importar alunos e fichas por planilha.
- Exportar historico do aluno.
- Sincronizar online com Supabase.
- Gerar link privado do aluno.
- Permitir multiplos professores por academia.
- Criar permissoes simples para professor e aluno.
