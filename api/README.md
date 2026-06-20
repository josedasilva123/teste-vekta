# ChatterBox 2.0 — API

PoC de REST API para conversas com IA (Python + FastAPI + MongoDB).

> Comandos abaixo assumem que você está na pasta `api/` (`cd api`).

## Pré-requisitos

- Python 3.11+
- [Poetry](https://python-poetry.org/)
- MongoDB (uma das opções abaixo)

## Setup local (sem Docker)

Recomendado quando não há espaço ou Docker disponível.

```powershell
# 1. Instalar dependências Python + preparar ambiente
.\scripts\setup-local.ps1

# 2. Iniciar MongoDB local (em outro terminal)
.\scripts\start-mongodb.ps1

# 3. Iniciar a API
poetry run chatterbox
```

A API estará em `http://localhost:8000` — documentação interativa em `/docs`.

### Alternativas ao MongoDB local

| Opção | Quando usar |
|-------|-------------|
| **MongoDB local** (`scripts/start-mongodb.ps1`) | Desenvolvimento offline |
| **MongoDB Atlas** (free tier) | Sem instalar nada; atualize `MONGODB_URI` no `.env` |
| **mongomock** (automático nos testes) | Apenas `pytest`, sem banco real |

### Variáveis de ambiente

Copie `.env.example` para `.env`. Para desenvolvimento sem chave Gemini:

```env
AI_PROVIDER=fake
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=chatterbox
```

## Docker Compose (opcional)

Disponível para quem tiver Docker. Apenas MongoDB:

```bash
docker compose up mongodb -d
```

Stack completa (API + MongoDB):

```bash
docker compose --profile full up --build
```

## Endpoints

Documentação completa (REST **e** WebSocket como alternativas): [`docs/API.md`](docs/API.md).

| Modo | Rota | Descrição |
|------|------|-----------|
| REST | `POST /api/v1/auth/register` | Cadastro |
| REST | `POST /api/v1/auth/login` | Login |
| REST | `GET /api/v1/auth/me` | Perfil autenticado |
| REST | `GET /api/v1/conversations` | Lista conversas do usuário |
| REST | `POST /api/v1/conversations` | Inicia conversa |
| REST | `GET /api/v1/conversations/{id}` | Obtém conversa e mensagens |
| REST | `POST /api/v1/conversations/{id}/messages` | Envia mensagem; resposta completa |
| **WS** | `WS /api/v1/conversations/{id}/ws?token=` | Streaming (requer JWT na query) |
| REST | `GET /health` | Health check |

## Testes

```powershell
poetry run pytest
poetry run pytest tests/unit          # use cases (sem banco)
poetry run pytest tests/integration   # API com mongomock
```

## Estrutura

```
src/chatterbox/
├── domain/          # Entidades, enums, ports (interfaces)
├── application/     # Casos de uso
├── infrastructure/  # MongoDB, Gemini, config
└── presentation/    # FastAPI (routers, schemas)
```

Documentação detalhada em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e [`docs/API.md`](docs/API.md).

## Scripts Poetry

```powershell
poetry run chatterbox    # inicia servidor
poetry run pytest        # testes
poetry run ruff check .  # lint
```
