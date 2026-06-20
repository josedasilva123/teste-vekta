# API — REST e WebSocket

A API oferece **duas alternativas** para enviar mensagens e receber respostas da IA. Ambas usam a mesma lógica de negócio, guards de prompt injection e persistência no MongoDB.

## Quando usar cada uma

| | **REST** | **WebSocket** |
|---|----------|---------------|
| **Uso ideal** | Integrações simples, testes, clientes HTTP | Frontend com chat ao vivo (streaming) |
| **Transporte** | HTTP request/response | Conexão persistente bidirecional |
| **Resposta da IA** | Completa de uma vez | Token a token (chunks) em tempo real |
| **Complexidade no front** | Baixa (`fetch`) | Média (`WebSocket`) |
| **Requisito do case** | Mínimo (a–d) | Opcional (e) |

> **Recomendação:** use REST para criar/obter conversas e testes; use WebSocket no React para exibir a digitação da IA em tempo real.

---

## Fluxo comum

1. `POST /api/v1/conversations` — cria conversa (REST)
2. Enviar mensagem via **REST** ou **WebSocket**
3. `GET /api/v1/conversations/{id}` — recupera histórico (REST)

---

## REST

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/conversations` | Inicia conversa |
| `GET` | `/api/v1/conversations/{id}` | Obtém conversa e mensagens |
| `POST` | `/api/v1/conversations/{id}/messages` | Envia mensagem; IA responde (resposta completa) |

### Exemplo

```http
POST /api/v1/conversations/{id}/messages
Content-Type: application/json

{"content": "Por que a Terra é plana?"}
```

```json
{
  "user_message": { "sender": "USER", "content": "..." },
  "ai_message": { "sender": "AI", "content": "..." }
}
```

---

## WebSocket

### Conexão

```
ws://localhost:8000/api/v1/conversations/{conversation_id}/ws
```

A conversa deve existir (criada via REST). A conexão permanece aberta para múltiplas mensagens.

### Cliente → servidor

```json
{
  "type": "message",
  "content": "Por que a Terra é plana?"
}
```

### Servidor → cliente (sequência típica)

```json
{"type": "user_message", "message": { "...": "..." }}
{"type": "chunk", "content": "A Terra "}
{"type": "chunk", "content": "é plana..."}
{"type": "done", "ai_message": { "...": "..." }}
```

### Eventos

| Evento | Descrição |
|--------|-----------|
| `user_message` | Confirma persistência da mensagem do usuário |
| `chunk` | Fragmento da resposta da IA (append no UI) |
| `replace` | Substitui texto acumulado (guard corrigiu a resposta) |
| `done` | Resposta final persistida; inclui `ai_message` completo |
| `error` | Erro de validação ou conversa não encontrada |

### Exemplo (JavaScript)

```javascript
const ws = new WebSocket(`ws://localhost:8000/api/v1/conversations/${id}/ws`);
let aiText = "";

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "chunk") aiText += data.content;
  if (data.type === "replace") aiText = data.content;
  if (data.type === "done") console.log("Final:", data.ai_message.content);
};

ws.onopen = () => {
  ws.send(JSON.stringify({ type: "message", content: "Olá!" }));
};
```

---

## Guards (ambos os modos)

Entrada e saída passam pelos mesmos guards documentados em [`patterns/prompt-injection.md`](patterns/prompt-injection.md). No WebSocket, se a resposta for corrigida após streaming, o evento `replace` informa o frontend para atualizar o texto exibido.
