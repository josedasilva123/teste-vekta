# ChatterBox Web

Frontend React para o ChatterBox — chat com IA em tempo real via WebSocket.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS
- React Router DOM
- Vitest + Testing Library

## Estrutura

```
src/
├── components/          # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── domains/
│   ├── auth/            # login, cadastro, sessão
│   └── chat/            # conversas e WebSocket
├── pages/               # rotas da aplicação
├── routes/              # guards e router
├── lib/                 # HTTP, storage
└── config/              # variáveis de ambiente
```

## Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Login |
| `/cadastro` | Público | Cadastro |
| `/chat` | Autenticado | Chat com streaming |

## Desenvolvimento

### Com Docker (API + Web juntos)

Na raiz do repositório:

```powershell
copy api\.env.example api\.env
docker compose up --build
```

A aplicação abre em `http://localhost:5173`.

### Sem Docker

1. Copie `.env.example` para `.env` e ajuste a URL da API se necessário.
2. Inicie a API em [`../api/`](../api/).
3. Instale dependências e rode o front:

```powershell
cd web
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Testes

```powershell
npm run test              # todos
npm run test:unit         # componentes, lib, domínios
npm run test:integration  # páginas e rotas
npm run test:watch        # modo watch
```

## Build

```powershell
npm run build
npm run preview
```
