# Farmei — Instruções do projeto

> **Para o Claude Code (ou qualquer dev) trabalhando neste projeto.**
> Esse documento explica o que existe, o que falta, e como continuar daqui.

---

## 1. O que é o Farmei

**Farmei** é um app de **eventos sociais** com duas metades que convivem no mesmo produto:

### 🔒 Eventos privados (modo "agendar com a galera")
Você cria um evento, convida pessoas específicas, e uma **IA escolhe a melhor data** com base na disponibilidade de todo mundo — com peso extra pra uma "key person" que precisa estar lá.

**Use case típico:** "Vamos almoçar pra planejar o Q3" → convida 6 pessoas → todo mundo marca os dias que pode → IA sugere "Terça, 4 de junho" porque é o único dia que o Diego (key person) está livre.

### 🌍 Eventos públicos (modo "o que está rolando")
Donos de lugar (bares, quadras, espaços) criam eventos abertos. Qualquer um pode ver e se inscrever — com **lotação máxima**, barra de ocupação em tempo real, e visibilidade social de quem mais vai.

**Use cases típicos:**
- Futebol na quadra de salão (12 vagas)
- Volley de praia (10 vagas)
- Show de Rock no Caverna Pub (80 vagas)
- Pagodinho no bar da esquina (40 vagas)

A diferença sutil mas importante: **eventos públicos não usam IA**. A data já é fixa, é só inscrição.

---

## 2. Histórico do nome

⚠️ **Atenção ao rebrand:**
- O nome **visual** do app é **Farmei** (aparece em logos, headers, telas, marketing)
- O nome **interno do código/docs** ainda é "Farmei" em vários lugares (README.md, comentários, SKILL.md, tokens CSS, etc.)
- **Quando for renomear pra valer no código,** procure por `farmei` (case-insensitive) e substitua. Aproximadamente 15 ocorrências em comentários e documentação.
- O logomark (square mark com V estilizado) também é da era Farmei — pode ser redesenhado pra refletir "Farmei" se quiser.

---

## 3. O que JÁ ESTÁ PRONTO neste projeto

### Design system completo
- **`colors_and_type.css`** — todos os tokens (cores, tipografia, espaçamento, sombras, motion)
- **`README.md`** — guia da marca: voz, tom, exemplos de copy, motivos visuais, regras de cor
- **`SKILL.md`** — manifest pra Agent Skills (se quiser reusar como skill)
- **`assets/`** — wordmark SVG, logomark SVG, sparkle SVG
- **`preview/`** — 23 cards de exemplo (tipografia, paleta, espaçamento, componentes, marca)

### UI kits visuais (React + JSX inline via Babel)
Cada kit é um protótipo visual, **não é produção**. Use como referência de design, não como código pra copiar.

- **`ui_kits/mobile/`** — 7 telas iOS originais do fluxo privado + 7 telas novas (público + social + host)
- **`ui_kits/marketing/`** — site de marketing completo (hero, features, pricing, footer)
- **`ui_kits/web/`** — app web desktop (sidebar + dashboard + calendário)

### Protótipo clicável end-to-end
- **`prototype.html`** (raiz) — 14 telas mockadas que dá pra clicar e navegar como se fosse o app real. URL com hash mantém posição no refresh.

---

## 4. O que NÃO existe (precisa ser construído de verdade)

### Backend
- **Nenhum backend existe.** Tudo são dados mockados no JSX.
- Precisa: autenticação, banco de dados, API REST/GraphQL, lógica de matching de datas (a "IA" do modo privado).

### Integrações
- **Instagram OAuth** — pra o feature "crush finder" e "amigos que vão no mesmo evento"
- **GPS / Mapas** — pra mostrar eventos próximos. Sugestão: Mapbox GL JS ou Google Maps API. O placeholder atual usa SVG estático.
- **Calendar sync** — opcional, pra puxar disponibilidade automaticamente (atualmente o user marca manualmente)
- **Notificações push** — quando alguém se inscreve, quando o evento se aproxima, etc.

### Mobile app real
- O `ui_kits/mobile/` é só uma representação visual em React inline. Pra app de verdade, sugiro:
  - **React Native** ou **Expo** (mais próximo do que está no protótipo)
  - **Flutter** se preferir
  - **Native iOS (Swift)** + **Native Android (Kotlin)** se for ir pesado

### Lógica do "AI date picker"
A "IA" do modo privado **não é uma IA de verdade** — é um algoritmo que precisa ser implementado:
1. Cada participante marca dias: ✓ yes (peso 1.0), ~ maybe (peso 0.5), ✕ no (peso 0)
2. Key person tem peso multiplicado (ex.: 3x)
3. Pra cada dia dentro da janela, soma os pesos
4. Maior soma vence
5. Empate: o dia mais cedo vence (ou regra de tiebreaker que você definir)
6. Confidence score = soma_do_dia / soma_máxima_possível

Não precisa de modelo de ML — é matemática simples. Mas se quiser "AI verdadeira" no futuro, pode usar Claude/GPT pra explicar a sugestão em linguagem natural ("Tuesday because Diego is free and only Felipe can't make it").

---

## 5. Features importantes a implementar (em ordem de prioridade sugerida)

### MVP (mês 1–2)
1. ✅ Login/signup (email + senha + opcionalmente Apple/Google)
2. ✅ Modo privado: criar evento, convidar, marcar disponibilidade, ver IA pick, confirmar
3. ✅ Algoritmo simples de "best date" (descrito acima)
4. ✅ Email/SMS de convite (Resend/Twilio)

### Fase 2 (mês 3–4)
5. ✅ Modo público: criar evento público, listar próximos, se inscrever
6. ✅ Lotação máxima + barra visual
7. ✅ Lista de inscritos + check-in pro host
8. ✅ Exportar lista de inscritos (CSV ou email) — pro merchandising

### Fase 3 (mês 5+)
9. ✅ Mapa com pins (Mapbox)
10. ✅ Integração Instagram (OAuth + ler "following list")
11. ✅ "Crush finder" — pessoas que sigo + estão indo aos mesmos eventos
12. ✅ Stories/feed do evento (fotos durante e depois)
13. ✅ Notificações push

---

## 6. Stack sugerido

**Esse é um sugestão, não obrigação.** Tudo aqui é compatível com o design system.

### Frontend
- **Web**: Next.js 15 + React 19 + Tailwind CSS + shadcn/ui
- **Mobile**: Expo (React Native) + NativeWind (Tailwind pra mobile) + Expo Router
- **Tokens de design**: copia `colors_and_type.css` e adapta pra Tailwind config

### Backend
- **API**: Node.js + Hono ou Bun + tRPC
- **DB**: PostgreSQL via Supabase ou Neon
- **Auth**: Clerk ou Supabase Auth
- **Storage** (fotos do evento): Cloudflare R2 ou Supabase Storage

### DevOps
- **Deploy web**: Vercel
- **Deploy mobile**: Expo EAS + TestFlight + Google Play
- **CI/CD**: GitHub Actions

---

## 7. Convenções de marca (NÃO desviar)

Veja `README.md` pra detalhes completos. Resumo dos non-negotiables:

- **Cor primária**: vermillion `#FF3B2E` — usar com moderação (5–10% dos pixels)
- **Cor de IA**: spark yellow `#FFD93D` — APENAS em momentos de IA (sugestão, shimmer, sparkle). 1–3% dos pixels.
- **Tipografia**: Bricolage Grotesque (display) + Geist (body) + JetBrains Mono (dates/data)
- **Voz**: warm, conversacional, segunda pessoa, sentence case, com leve sotaque latino ("¡Vamos!", "Buenas")
- **Proibido**: gradientes bluish-purple, emojis dentro de controles, "seamless/effortless/empower", textos em ALL CAPS exceto eyebrows
- **Sombra-assinatura**: o "stamp" — sombra ink de 2-4px sem blur — em CTAs primários e cards de IA

---

## 8. Como rodar localmente

Tudo aqui é HTML estático + React via CDN. Não precisa build.

```bash
# Servir o projeto (qualquer servidor estático)
python3 -m http.server 8000
# Ou
npx serve .
```

Abra:
- `http://localhost:8000/prototype.html` — o protótipo clicável end-to-end
- `http://localhost:8000/ui_kits/mobile/index.html` — todas as telas mobile lado a lado
- `http://localhost:8000/ui_kits/marketing/index.html` — site de marketing
- `http://localhost:8000/ui_kits/web/index.html` — app web desktop

---

## 9. Arquivos importantes pro Claude Code ler primeiro

1. **Este arquivo** (`CLAUDE.md`)
2. **`README.md`** — guia de marca completo
3. **`colors_and_type.css`** — tokens de design
4. **`prototype.html`** — entender o fluxo end-to-end
5. **`ui_kits/mobile/screens-*.jsx`** — referência pra cada tela individual

---

## 10. Como pedir mudanças visuais ao Claude

O design system foi criado pra ser **enxuto e opinativo**. Se for pedir mudanças:

- **Cores**: ajuste `colors_and_type.css` (as variáveis CSS são a única fonte da verdade)
- **Telas**: cada tela é um componente em `ui_kits/mobile/screens-*.jsx`. Edite só o componente, o resto é compartilhado.
- **Componentes reusáveis**: ficam em `ui_kits/mobile/components.jsx` (e equivalentes em web/marketing)

Para novas telas: copie o pattern de uma existente (`HomeScreen`, `CreateScreen`, etc.) — todas seguem o mesmo template (AppHeader + corpo + CTAs).

---

**Boa sorte!** 🚀

Se tiver dúvidas sobre alguma decisão de design, pergunta — está tudo documentado no README. Se o documento não responder, pergunte ao designer original (eu).

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
