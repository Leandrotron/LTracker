# DATA_SCHEMA

Proposta inicial simples para uso com localStorage.

## Chave sugerida

```text
ltracker.data
```

## Formato sugerido

```json
{
  "days": {
    "2026-05-20": {
      "dayStatus": "active",
      "statusNote": "",
      "weight": "61.32",
      "sleepHours": "7.03",
      "sleepQuality": "",
      "mood": "",
      "soreness": "",
      "notes": "",
      "activities": [
        {
          "type": "Corrida",
          "duration": "32.5",
          "intensity": "",
          "distance": "3.25",
          "notes": ""
        },
        {
          "type": "Caminhada",
          "duration": "30",
          "intensity": "",
          "distance": "0.8",
          "notes": ""
        },
        {
          "type": "Academia",
          "duration": "45",
          "intensity": "",
          "workoutPlan": "A",
          "workoutFeeling": "",
          "notes": ""
        }
      ]
    }
  },
  "workoutTemplates": {
    "A": {
      "title": "Treino A - Superiores",
      "groups": [
        {
          "title": "Superiores",
          "exercises": [
            {
              "name": "Supino inclinado",
              "weight": "",
              "notes": "",
              "photo": ""
            }
          ]
        }
      ]
    },
    "B": {
      "title": "Treino B - Inferiores",
      "groups": [
        {
          "title": "Inferiores",
          "exercises": [
            {
              "name": "Extensora unilateral",
              "weight": "",
              "notes": "",
              "photo": ""
            }
          ]
        }
      ]
    }
  }
}
```

## Observacoes

- Backup manual exporta e importa exatamente o objeto salvo em `localStorage` na chave `ltracker.data`.
- Um arquivo importado precisa ser um objeto JSON com `days` tambem como objeto. Campos opcionais atuais, como `workoutTemplates` e `gym`, devem permanecer como objetos quando existirem.
- A importacao substitui o conteudo local somente apos confirmacao do usuario.
- A data do dia deve ser a chave principal de consulta diaria.
- Cada dia fica salvo dentro de `days` usando o formato `YYYY-MM-DD`.
- `weight` guarda texto numerico normalizado com ponto decimal quando informado. Exemplo: `61,32` vira `61.32`.
- `sleepHours` continua sendo o campo principal de sono e guarda horas em decimal normalizado. Exemplo: `7:02` vira aproximadamente `7.03`.
- Entradas antigas com virgula decimal ou sono no formato `h:min` ainda sao lidas pelo resumo semanal quando possivel.
- Escalas simples de 1 a 5 sao usadas para qualidade do sono, disposicao, intensidade percebida e sensacao do treino.
- `dayStatus` guarda o status neutro do dia: `active`, `planned_rest`, `recovery` ou `sick`.
- `statusNote` guarda uma nota opcional sobre o status do dia.
- `activities` guarda as atividades registradas no dia atual.
- `completedExercises` guarda, por dia e por treino, os exercicios marcados como concluidos na execucao local do treino.
- `duration` guarda minutos em decimal normalizado quando informado. Exemplo: `32:30` vira `32.5`.
- Corrida, Bike e Caminhada usam `distance`, tambem normalizado com ponto decimal quando informado.
- Academia usa `workoutPlan` e `workoutFeeling`.
- `workoutTemplates` guarda a estrutura local de treinos A/B/C usada pela ficha.
- `gym.students` guarda a lista local inicial de alunos cadastrados no Admin da branch `gym-edition`.
- Cada aluno usa `id`, `name`, `startDate`, `note`, `createdAt` e pode ter `workoutTemplates`.
- `student.currentProgram` guarda o programa atual copiado para o aluno, com `name`, `note`, `sourceProgramId`, `workoutTemplates` e `appliedAt`.
- `student.workoutTemplates` guarda a ficha individual do aluno para compatibilidade e execucao no app do aluno.
- `gym.programLibrary` guarda programas base da academia, com `id`, `name`, `note`, `workoutTemplates` e `createdAt`.
- Cada programa contem treinos internos dentro de `workoutTemplates`; a chave pode ser `A`, `B`, `C` ou outro texto curto.
- Cada treino interno pode ter `title` opcional, como Superiores, Inferiores ou Full body.
- Cada exercicio em `gym.programLibrary[].workoutTemplates[treino].groups[].exercises` usa `name`, `muscleGroup`, `weight`, `notes` e `photo`.
- `gym.templateLibrary` pode existir em backups antigos e e migrado localmente para `gym.programLibrary`.
- `gym.currentStudentId` guarda o aluno selecionado como aluno atual.
- `gym.currentStudentName` guarda o nome do aluno atual para compatibilidade com a versao local inicial.
- Cada treino possui `title` e `groups`; nesta etapa, o app usa um grupo simples por treino.
- A lista `groups[].exercises` guarda objetos de exercicio na ordem de execucao.
- Cada exercicio de treino usa `name`, `weight`, `notes` e `photo`.
- `photo` guarda uma foto opcional do equipamento como data URL. Quando nao houver foto, fica vazio.
- Dados antigos em que `groups[].exercises` continha apenas strings sao convertidos automaticamente para objetos.
- Quando `workoutTemplates` ainda nao existir, o app usa os programas/treinos padrao atuais.
- Se houver dados antigos em `gym.exercises`, o app tenta migrar os nomes e a ordem para `workoutTemplates`.
- O modo editar ficha permite adicionar, remover, reorganizar e editar detalhes opcionais dos exercicios.
- O resumo semanal usa apenas os dados ja existentes em `days`.
- Dias sem `dayStatus` salvo sao lidos como `active` para manter compatibilidade com dados antigos.
- O schema pode mudar conforme o MVP evoluir.
