# ChatterBox 2.0

PoC do sistema de conversas com IA — monorepo.

## Estrutura

```
├── api/    # REST API (Python + FastAPI + MongoDB)
└── web/    # Frontend (React) — em breve
```

## Início rápido

### Docker (API + Web + MongoDB)

Com Docker instalado, na raiz do repositório:

```powershell
copy api\.env.example api\.env   # ajuste GEMINI_API_KEY ou AI_PROVIDER=fake
docker compose up --build
```

- API: `http://localhost:8000` (docs em `/docs`)
- Web: `http://localhost:5173`

### Desenvolvimento local (sem Docker)

**API**

```powershell
cd api
.\scripts\setup-local.ps1
.\scripts\start-mongodb.ps1   # outro terminal
poetry run chatterbox
```

Documentação completa em [`api/README.md`](api/README.md).

**Web**

```powershell
cd web
npm install
npm run dev
```

Ver [`web/README.md`](web/README.md).
