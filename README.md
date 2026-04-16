# 🛡️ Teclado Protetor

> **Teclado Android com análise de links em tempo real — protegendo o usuário no momento exato do clique.**

<br/>

## O Problema

Golpes digitais no Brasil crescem a cada ano. Phishing bancário, PIX premiado falso, clonagem de WhatsApp — e a vítima só descobre depois de clicar.

Os antivírus e filtros tradicionais atuam **depois** do clique, quando o dano já pode estar feito.

O **Teclado Protetor** atua **antes** — no momento da digitação, quando o usuário ainda pode recuar.

<br/>

## Como Funciona

Ao receber um link suspeito por WhatsApp, e-mail ou SMS, o usuário cola o endereço diretamente no teclado. Em segundos:

- 🔍 O domínio é consultado na base de dados de ameaças
- ⚖️ O nível de risco é calculado (seguro, suspeito, perigoso, phishing)
- 🚨 Um alerta visual contextualizado aparece — sem jargão técnico
- 🤖 O Assistente IA explica o golpe e orienta o que fazer

Tudo isso **antes** de qualquer clique.

<br/>

## Demonstração

O protótipo simula um ambiente real de uso: conversas de WhatsApp com diferentes perfis de risco — link de banco legítimo, grupo com golpe de PIX, phishing de rede social, falso site governamental.

| Cenário | Link | Resultado |
|---------|------|-----------|
| Banco do Brasil (oficial) | `www.bb.com.br` | ✅ Seguro |
| Facebook (oficial) | `www.facebook.com` | ✅ Seguro |
| Golpe PIX premiado | `pix-premiado-brasil.com` | ⛔ Golpe financeiro |
| Phishing Itaú | `conta-itau-online.com` | ⛔ Phishing bancário |
| Falso Gov.BR | `gov-br-servicos.online` | ⛔ Imitação governamental |
| Clonagem WhatsApp | `suporte-whatsapp-verificacao.com` | ⛔ Golpe de clonagem |
| Link encurtado | `bit.ly` | ⚠️ Suspeito |

<br/>

## Funcionalidades do Protótipo

- **📱 Interface fiel ao WhatsApp** — lista de conversas, chat, status, teclado animado
- **🔍 Análise em tempo real** — classifica o link enquanto o usuário digita
- **📊 Painel de detalhes** — reputação, WHOIS, Google Safe Browsing e VirusTotal simulados
- **🤖 Assistente IA (Claude)** — explica o golpe com contexto específico, responde perguntas, orienta ações
- **💬 Chips de sugestão** — perguntas contextuais adaptadas ao tipo de ameaça detectada
- **🔒 Escopo restrito** — o assistente responde exclusivamente sobre segurança digital

<br/>

## Tecnologia

- **Frontend:** HTML, CSS e JavaScript puros — sem frameworks, sem dependências externas
- **IA:** [Claude API](https://anthropic.com) (Anthropic) — modelo `claude-sonnet-4-20250514`
- **Avatares:** [DiceBear](https://dicebear.com) (geração procedural por seed)
- **Arquitetura:** Protótipo client-side, sem backend

<br/>

## Por Que o Teclado?

O teclado é o único ponto de entrada universal em qualquer app — WhatsApp, SMS, navegador, e-mail. Não importa onde o golpe chega: se o usuário vai digitar ou colar algo, o teclado está lá.

É a camada de proteção que o ecossistema Android ainda não tem.

<br/>

## Status

> 🔒 **Repositório privado** — protótipo em desenvolvimento.

Este projeto está em fase de prototipação. O código não está disponível publicamente.

---

<sub>Feito com 🛡️ para proteger quem mais precisa — especialmente quem não entende de tecnologia.</sub>
