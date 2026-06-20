# ChatterBox 2.0

PoC do sistema de conversas com IA — monorepo.

## Estrutura

```
├── api/    # REST API (Python + FastAPI + MongoDB)
└── web/    # Frontend (React) — em breve
```

## Início rápido

### API

```powershell
cd api
.\scripts\setup-local.ps1
.\scripts\start-mongodb.ps1   # outro terminal
poetry run chatterbox
```

Documentação completa em [`api/README.md`](api/README.md).

### Web

Em desenvolvimento. Ver [`web/README.md`](web/README.md).
