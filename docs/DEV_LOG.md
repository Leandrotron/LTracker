# DEV_LOG

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
