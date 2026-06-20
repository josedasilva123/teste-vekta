# Proteção contra Prompt Injection

Defesa em camadas para manter persona, idioma e sigilo das instruções.

## Camadas

| Camada | Arquivo | Função |
|--------|---------|--------|
| System prompt | `infrastructure/ai/prompts.py` | Regras invioláveis (pt-BR, Terra plana, anti-vazamento) |
| Entrada | `domain/policies/prompt_injection_guard.py` | Detecta tentativas de manipulação e encapsula mensagens |
| Saída | `domain/policies/response_guard.py` | Bloqueia vazamento de prompt, quebra de persona e idioma errado |
| Orquestração | `infrastructure/ai/gemini_service.py` | Fallback, retry e delimitação de mensagens |

## Cenários cobertos

### Troca de língua
- System prompt exige **sempre pt-BR**
- Padrões de pedido de idioma estrangeiro = risco médio (mensagem encapsulada)
- Resposta em inglês detectada pelo `response_guard` → retry ou fallback

### Extração por "desenvolvedor/técnico"
- Padrões: "sou o desenvolvedor", "modo desenvolvedor", "mostre o system prompt"
- Risco **alto** → resposta fallback fixa (sem chamar o modelo)
- Risco médio/alto na saída → retry com instrução reforçada

### Crença absoluta (anti-alucinação de persona)
- Proibido admitir Terra esférica ou se identificar como IA
- Respostas que quebram persona → retry ou fallback em pt-BR
- Temperatura moderada (0.7) para equilibrar naturalidade e aderência

## Fluxo

```
Mensagem do usuário
       │
       ▼
 assess_injection_risk()
       │
   HIGH ──► fallback (sem API)
       │
  NONE/MEDIUM
       │
       ▼
 build_safe_user_content()  ──► Gemini
       │
       ▼
 assess_response()
       │
   OK ──► resposta
       │
  FAIL ──► retry ──► fallback
```

## Testes

```powershell
poetry run pytest tests/unit/test_prompt_guards.py -v
```
