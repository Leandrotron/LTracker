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
  "gym": {
    "exercises": [
      {
        "id": "gym-a-001",
        "workout": "A",
        "order": 1,
        "name": "Supino inclinado",
        "load": "",
        "sets": "4",
        "reps": "8-10",
        "note": "",
        "photoDataUrl": ""
      }
    ]
  }
}
```

## Observacoes

- A data do dia deve ser a chave principal de consulta diaria.
- Cada dia fica salvo dentro de `days` usando o formato `YYYY-MM-DD`.
- `weight` guarda texto numerico normalizado com ponto decimal quando informado. Exemplo: `61,32` vira `61.32`.
- `sleepHours` continua sendo o campo principal de sono e guarda horas em decimal normalizado. Exemplo: `7:02` vira aproximadamente `7.03`.
- Entradas antigas com virgula decimal ou sono no formato `h:min` ainda sao lidas pelo resumo semanal quando possivel.
- Escalas simples de 1 a 5 sao usadas para qualidade do sono, disposicao, intensidade percebida e sensacao do treino.
- `dayStatus` guarda o status neutro do dia: `active`, `planned_rest`, `recovery` ou `sick`.
- `statusNote` guarda uma nota opcional sobre o status do dia.
- `activities` guarda as atividades registradas no dia atual.
- `duration` guarda minutos em decimal normalizado quando informado. Exemplo: `32:30` vira `32.5`.
- Corrida, Bike e Caminhada usam `distance`, tambem normalizado com ponto decimal quando informado.
- Academia usa `workoutPlan` e `workoutFeeling`.
- `gym.exercises` guarda a ficha interna de academia dentro da mesma chave `ltracker.data`.
- Cada exercicio da ficha usa `workout` para agrupar em Treino A ou Treino B.
- Quando `gym.exercises` ainda estiver vazio, o app insere a ficha inicial do usuario com Treino A de superiores e Treino B de inferiores.
- A ficha inicial nao sobrescreve exercicios ja cadastrados.
- Na lista da ficha, a edicao simples atualiza apenas `load`, `note` e `photoDataUrl`.
- `photoDataUrl` guarda uma foto opcional do aparelho/exercicio como data URL. Quando nao houver foto, fica vazio.
- O resumo semanal usa apenas os dados ja existentes em `days`.
- Dias sem `dayStatus` salvo sao lidos como `active` para manter compatibilidade com dados antigos.
- O schema pode mudar conforme o MVP evoluir.
