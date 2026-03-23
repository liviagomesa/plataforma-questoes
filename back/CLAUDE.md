# Backend — Spring Boot

## Estrutura
- `config/WebConfig.java` — CORS para `localhost:4200`
- `question/` — feature única, segue o padrão Controller → Service → Repository
- `question/dto/` — records imutáveis para request/response

## Campo `data`
Armazenado como `TEXT` no banco. Serializado/desserializado pelo `QuestionService`
via `ObjectMapper`. O schema varia por `QuestionType` — ver CLAUDE.md raiz.

## Convenções
- Sem camada de mapper: `toResponse()` privado no próprio Service
- `ResponseStatusException` para erros 404
- Flyway gerencia o schema (não usar `ddl-auto: create`)
