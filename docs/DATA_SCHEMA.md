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
      "entries": [
        {
          "id": "entry-1779282000000-a1b2c3",
          "type": "gym",
          "workout": "A",
          "duration": "45",
          "distance": "",
          "intensity": "",
          "notes": "",
          "completedExercises": [
            "0-Supino inclinado"
          ]
        },
        {
          "id": "entry-1779285600000-d4e5f6",
          "type": "walk",
          "duration": "30",
          "distance": "0.8",
          "intensity": "",
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
- `entries` guarda os registros do dia em ordem de criacao e permite multiplos itens no mesmo dia.
- Cada entrada usa `id`, `type`, `duration`, `distance`, `intensity` e `notes`.
- Tipos atuais de `entries[].type`: `gym`, `walk`, `run`, `bike`, `rest`, `sick` e `other`.
- `gym` usa `workout` A/B/C e `completedExercises` dentro da propria entrada.
- `completedExercises` guarda as chaves dos exercicios marcados como concluidos naquele registro de treino.
- `duration` guarda minutos em decimal normalizado quando informado. Exemplo: `32:30` vira `32.5`.
- `walk`, `run` e `bike` usam `distance`, tambem normalizado com ponto decimal quando informado.
- `walk`, `run` e `bike` podem usar `intensity` em escala simples de 1 a 5.
- `rest`, `sick` e `other` normalmente usam apenas `notes`.
- Campos antigos como `activities`, `dayStatus`, `statusNote`, `workoutPlan`, `workoutFeeling`, `status` ou `completedExercises` direto no dia sao migrados/renderizados para `entries` sem quebrar backups antigos.
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
- O historico usa `entries` como fonte principal e ainda aceita formatos antigos durante a migracao local.
- O schema pode mudar conforme o MVP evoluir.
