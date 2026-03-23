# Frontend — Angular

## Estrutura
Organizado por feature em `src/app/features/`. Cada feature tem seus próprios componentes.

- `question-list/` — listagem e exclusão de questões
- `question-create/` — criação/edição; usa sub-componentes de formulário por tipo
- `question-answer/` — resposta e verificação; usa sub-componentes de resposta por tipo

## Convenções
- Todos os componentes são **standalone** (sem NgModule)
- Lazy loading via `loadComponent` em `app.routes.ts`
- Sem chamadas HTTP nos componentes — tudo via `QuestionService`

## Drag and Drop
Usa `@angular/cdk/drag-drop`. Importar `DragDropModule` em cada componente que usa DnD.
- Sorting: `moveItemInArray` em único `cdkDropList`
- Matching: `transferArrayItem` entre banco e slots individuais
- Table: `transferArrayItem` entre banco e células individuais

## Embaralhamento
`shuffle.ts` (Fisher-Yates) chamado no `ngOnInit` de cada answer-component.
O `data` vindo da API nunca é mutado.

## Proxy de desenvolvimento
`src/proxy.conf.json` redireciona `/api/` para `http://localhost:8080`.
Em produção (Docker), nginx faz o proxy.
