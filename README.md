# Plataforma de Questões

Aplicação web para criação e resolução de questões avaliativas, desenvolvida como ferramenta de estudo pessoal.

> **100% gerado com [Claude Code](https://claude.ai/code)** — nenhuma linha de código foi escrita manualmente.

## Funcionalidades

- Criação, edição e exclusão de questões
- 5 tipos de questão:
  - **Múltipla Escolha** — selecionar a alternativa correta
  - **Discursiva** — resposta aberta com gabarito revelado ao submeter
  - **Ordenação** — arrastar itens para a sequência correta
  - **Associação** — arrastar termos para suas respectivas definições
  - **Tabela** — arrastar cards para preencher células de uma tabela
- Opções embaralhadas a cada tentativa (Fisher-Yates)
- Feedback imediato de acerto/erro
- Campo de comentário opcional exibido apenas no acerto (para reforço de conteúdo)
- Tentativas ilimitadas
- Persistência de dados entre reinicializações

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 17 (standalone components) |
| Drag & Drop | Angular CDK DragDrop |
| Backend | Spring Boot 3.x (Java 21) |
| Banco de dados | PostgreSQL 16 |
| Migrations | Flyway |
| API Docs | Swagger (springdoc-openapi) |
| Infraestrutura | Docker Compose |

## Como rodar

Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.

```bash
git clone https://github.com/liviagomesa/plataforma-questoes.git
cd plataforma-questoes
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Swagger | http://localhost:8080/swagger-ui.html |

Para parar: `docker compose down`
Os dados persistem no volume `pgdata` entre reinicializações.

## Arquitetura

```
plataforma-questoes/
├── docker-compose.yml
├── front/          # Angular 17 — SPA servida via nginx
└── back/           # Spring Boot — API REST em /api/questions
```

O frontend consome a API via proxy nginx em produção (`/api/ → back:8080`). As questões são armazenadas em uma tabela PostgreSQL com o campo `data` em JSON, permitindo que cada tipo de questão tenha sua própria estrutura sem migrações adicionais.
