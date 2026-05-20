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
      "weight": "",
      "sleepHours": "",
      "sleepQuality": "",
      "mood": "",
      "soreness": "",
      "notes": "",
      "activities": [
        {
          "type": "Corrida",
          "duration": "",
          "intensity": "",
          "distance": "",
          "notes": ""
        },
        {
          "type": "Academia",
          "duration": "",
          "intensity": "",
          "workoutPlan": "A",
          "workoutFeeling": "",
          "notes": ""
        }
      ]
    }
  }
}
```

## Observacoes

- A data do dia deve ser a chave principal de consulta diaria.
- Cada dia fica salvo dentro de `days` usando o formato `YYYY-MM-DD`.
- Escalas simples de 1 a 5 sao usadas para qualidade do sono e disposicao.
- `activities` guarda as atividades registradas no dia atual.
- Corrida e Bike usam `distance`.
- Academia usa `workoutPlan` e `workoutFeeling`.
- O resumo semanal usa apenas os dados ja existentes em `days`, sem campos adicionais.
- O schema pode mudar conforme o MVP evoluir.
