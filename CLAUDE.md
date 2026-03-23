# Plataforma de Questões — Visão Geral

## O que é
Aplicação local de estudo pessoal para criação e resolução de questões avaliativas.
Roda exclusivamente via `docker compose up --build`.

## Stack
- **Front**: Angular 17 (standalone components, Angular CDK DragDrop)
- **Back**: Spring Boot 3.x + Java 21
- **Banco**: PostgreSQL 16 (volume Docker persistente)
- **Migrations**: Flyway

## Como rodar
```bash
docker compose up --build
# Frontend: http://localhost:4200
# Swagger:  http://localhost:8080/swagger-ui.html
```

## Tipos de questão
| Tipo | Interação |
|------|-----------|
| MULTIPLE_CHOICE | Radio buttons embaralhados |
| DISCURSIVE | Textarea livre + exibe gabarito |
| SORTING | CDK DragDrop, reordenar cards |
| MATCHING | CDK DragDrop, banco de termos → slots ao lado das definições |
| TABLE | CDK DragDrop, banco de cards → células da tabela |

## Modelo de dados
Uma tabela `questions` com campo `data TEXT` armazenando JSON específico de cada tipo.
O campo é serializado/desserializado pelo `QuestionService` via Jackson `ObjectMapper`.

## Embaralhamento
Feito 100% no frontend (`shuffle.ts`, Fisher-Yates) no `ngOnInit` de cada answer-component.
O `data` original vindo da API nunca é mutado.
