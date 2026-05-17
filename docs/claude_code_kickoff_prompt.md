# Claude Code Kickoff Prompt — Farmei MVP

Você está entrando em um projeto que **já tem design system, protótipos e direção de produto**, mas **ainda não tem implementação real de software**. Sua missão é transformar esse material em um **MVP funcional, organizado, escalável e fiel ao design**.

Leia este documento inteiro antes de agir.

---

## 1. Sua função neste projeto

Atue como uma combinação de:

- Staff Software Engineer
- Software Architect
- Product-minded Engineer
- Frontend + Backend builder
- Guardião de consistência do design system

Seu papel **não é apenas gerar código**. Seu papel é:

1. entender o produto;
2. mapear arquitetura e domínio;
3. criar a base técnica correta;
4. priorizar o MVP certo;
5. evitar escopo desnecessário;
6. implementar em fases sem destruir coerência.

Não comece “fazendo telas bonitas”.
Não comece “copiando JSX de protótipo”.
Não comece “inventando features”.

Primeiro pense, depois estruture, depois implemente.

---

## 2. Contexto do produto

O produto se chama **Farmei**.

Ele possui **duas frentes dentro do mesmo app**:

### A. Eventos privados com sugestão inteligente de data

Um organizador:
- cria um evento;
- convida pessoas específicas;
- define uma janela de datas possíveis;
- opcionalmente define uma **key person**;
- os convidados marcam disponibilidade;
- o sistema calcula a melhor data com base em pesos;
- o organizador confirma a data final.

### B. Eventos públicos com data fixa

Um host:
- cria um evento público;
- define data fixa, capacidade, local e descrição;
- usuários descobrem o evento;
- se inscrevem;
- o sistema controla lotação e lista de inscritos.

### Ponto crítico

Esses dois modos convivem no mesmo produto, mas **não devem ser misturados em domínio, regra de negócio ou UX de maneira confusa**.

- **Privado** usa lógica de disponibilidade e sugestão de melhor dia.
- **Público** não usa IA de data; usa data fixa e inscrição.

---

## 3. Inventário já existente

O projeto já possui material forte de design e direção. Considere isso como fonte de verdade visual e de produto.

### Existe hoje

- design system completo;
- tokens de cor, tipografia, spacing, motion e sombras;
- voz de marca definida;
- protótipos visuais e telas clicáveis;
- UI kits mobile, marketing e web;
- documentação explicando o produto e a intenção do projeto.

### Não existe ainda

- backend real;
- autenticação real;
- banco de dados real;
- API real;
- modelagem de domínio consolidada;
- algoritmo implementado;
- integrações reais;
- app mobile real;
- monorepo de produção.

---

## 4. Arquivos que você deve ler primeiro

Antes de criar qualquer coisa, leia na ordem abaixo:

1. `CLAUDE.md`
2. `README.md`
3. `colors_and_type.css`
4. arquivos do protótipo/telas clicáveis
5. quaisquer assets ou componentes de UI kit

### Objetivo dessa leitura

Extraia destes arquivos:

- visão do produto;
- limites do MVP;
- regras de marca;
- regras de copy;
- comportamento esperado das telas;
- diferenças entre os modos privado e público;
- stack sugerida;
- prioridades já sugeridas.

Não trate os protótipos como código de produção.
Use-os como referência de fluxo e design.

---

## 5. Rebrand obrigatório

Há um rebrand em andamento de **Farmei** para **Farmei**.

### Regra

- Nome visível do produto: **Farmei**
- Código legado/documentação pode conter `farmei`
- Durante a estruturação do projeto real, trate isso conscientemente

### O que fazer

- usar **Farmei** em interfaces, títulos, textos de produto e documentação nova;
- identificar referências legadas a `farmei` e planejar refactor controlado;
- não quebrar o projeto por tentar renomear tudo de uma vez sem estratégia;
- criar uma tarefa explícita de migração de naming.

---

## 6. Objetivo principal

Transformar o material atual em um **MVP real de software**, com base sólida para evolução.

### Definição de sucesso

Ao final do primeiro ciclo, o projeto deve ter:

- arquitetura documentada;
- monorepo organizado;
- app web funcional;
- autenticação funcionando;
- banco modelado;
- fluxo privado MVP funcionando;
- fluxo público MVP funcionando;
- design tokens integrados de forma consistente;
- testes mínimos dos fluxos críticos;
- ambiente local fácil de subir;
- código legível, modular e escalável.

---

## 7. Estratégia de produto e escopo

### Decisão arquitetural obrigatória

**Não construir web e mobile completos ao mesmo tempo.**

Comece por:

- **web app real**;
- **API real**;
- **domínio e banco corretos**;
- componentes reaproveitáveis;
- design tokens compartilháveis;
- arquitetura preparada para um app mobile futuro.

### Justificativa

O maior risco agora não é UI. É:

- modelagem de domínio;
- separação correta entre evento privado e público;
- autenticação;
- convites;
- disponibilidade;
- algoritmo de melhor data;
- controle de lotação.

### Fora do escopo deste primeiro ciclo

Não implemente agora:

- Instagram OAuth;
- crush finder;
- stories/feed do evento;
- push notifications;
- calendário externo;
- mapa real com geolocalização avançada;
- pagamentos;
- app mobile nativo/Expo completo.

Se algo precisar ser preparado para o futuro, deixe a arquitetura pronta, mas **não entregue a feature agora**.

---

## 8. Stack técnica obrigatória para o primeiro ciclo

Use uma stack moderna, estável e pragmática.

### Escolha padrão

- **Monorepo** com `pnpm`
- **apps/web**: Next.js 15 + React 19 + TypeScript
- **services/api**: Hono + TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **UI**: Tailwind CSS + shadcn/ui como base técnica, adaptado ao design system próprio
- **Validation**: Zod
- **Forms**: React Hook Form + Zod Resolver
- **Dates**: date-fns
- **Testing**: Vitest para unitários + Playwright para smoke/e2e críticos
- **Lint/Format**: ESLint + Prettier

### Observações

- Se algum item acima criar bloqueio sério, documente o motivo antes de trocar.
- Não troque stack por preferência pessoal sem necessidade objetiva.
- Priorize coerência e velocidade com qualidade.

---

## 9. Estrutura inicial do repositório

Crie a base assim:

```txt
/apps
  /web
/packages
  /ui
  /design-tokens
  /types
  /utils
  /config
/services
  /api
/docs
  PRD.md
  ARCHITECTURE.md
  TASKS.md
  DECISIONS.md
```

### Regras

- `apps/web`: aplicação web real
- `services/api`: API do domínio
- `packages/ui`: componentes compartilhados
- `packages/design-tokens`: tokens derivados do design system atual
- `packages/types`: contratos e tipos compartilhados
- `packages/utils`: helpers reutilizáveis
- `packages/config`: configs compartilhados de lint/ts/tailwind, se fizer sentido
- `docs`: documentação operacional do projeto

Não crie estrutura inflada sem uso real.
Não crie dez packages vazios só por “arquitetura bonita”.

---

## 10. Ordem obrigatória de execução

Siga esta sequência.

### Fase 0 — Auditoria e planejamento

Antes de codar:

1. ler os arquivos existentes;
2. mapear funcionalidades existentes no design;
3. listar gaps entre design e software real;
4. consolidar decisões em documentação.

### Fase 1 — Documentação operacional

Crie ou consolide os seguintes arquivos:

#### `docs/PRD.md`
Deve conter:
- visão do produto;
- público-alvo;
- proposta de valor;
- jornadas principais;
- escopo do MVP;
- fora do escopo;
- métricas de sucesso;
- riscos.

#### `docs/ARCHITECTURE.md`
Deve conter:
- visão da arquitetura;
- módulos e bounded contexts;
- estrutura do monorepo;
- fluxos principais;
- estratégia de autenticação;
- estratégia de persistência;
- contratos entre web e API;
- decisões de escalabilidade futuras.

#### `docs/TASKS.md`
Deve conter:
- backlog inicial;
- dependências entre tarefas;
- milestones;
- entregas por fase.

#### `docs/DECISIONS.md`
Deve conter:
- ADRs curtos;
- decisões de naming;
- decisões de stack;
- decisões de modelagem;
- trade-offs.

### Fase 2 — Foundation do projeto

Depois da documentação:

1. inicializar monorepo;
2. configurar TypeScript, lint, format e test;
3. integrar Tailwind e tokens do design;
4. estruturar layout base;
5. configurar banco e migrations;
6. configurar auth;
7. preparar API.

### Fase 3 — Core do domínio

Implementar primeiro:

- modelo de usuário;
- modelo de evento;
- convites;
- disponibilidade;
- inscrição;
- capacidade;
- algoritmo de melhor data.

### Fase 4 — Fluxos web do MVP

Implementar:

- login/signup;
- dashboard base;
- criar evento privado;
- convidar pessoas;
- responder disponibilidade;
- calcular melhor data;
- confirmar evento;
- criar evento público;
- listar eventos públicos;
- detalhe do evento;
- inscrição;
- visão básica do host.

### Fase 5 — Qualidade e hardening

- testes unitários críticos;
- testes e2e mínimos;
- tratamento de erros;
- estados vazios/loading;
- revisão de acessibilidade;
- limpeza de mocks;
- `.env.example`;
- seed opcional de desenvolvimento.

---

## 11. Escopo funcional do MVP

### 11.1 Autenticação

Entregar:
- signup por email e senha;
- login por email e senha;
- logout;
- sessão persistida;
- perfil básico.

Pode deixar social login para depois.

### 11.2 Modo privado

Entregar:
- criar evento privado;
- editar informações principais;
- convidar participantes;
- definir janela de datas;
- definir key person opcional;
- coletar disponibilidade;
- calcular melhor data;
- exibir racional simples da sugestão;
- confirmar data final.

### 11.3 Modo público

Entregar:
- criar evento público;
- listar eventos públicos;
- visualizar detalhe;
- inscrever-se;
- cancelar inscrição;
- respeitar lotação máxima;
- visualizar lista básica de inscritos no painel do host.

### 11.4 Host / Organizer dashboard

Entregar visão simples com:
- eventos criados;
- status;
- número de convidados/inscritos;
- ações principais.

---

## 12. Regras de negócio obrigatórias

### 12.1 Algoritmo do melhor dia

Implemente de forma determinística.

#### Pesos
- `yes = 1.0`
- `maybe = 0.5`
- `no = 0`

#### Key person
- participante-chave tem multiplicador configurável;
- default recomendado: `3x`.

#### Regra principal
Para cada dia dentro da janela:
1. some os pesos dos participantes;
2. aplique multiplicador para key person, se houver;
3. escolha o dia com maior score.

#### Desempate
- em caso de empate, vence o dia mais cedo.

#### Confidence score
Calcule:

```txt
confidence = score_do_dia / score_maximo_possivel
```

#### Explicação textual
O sistema deve gerar uma justificativa simples e humana, por exemplo:

- “Tue, Jun 4 funciona melhor porque a key person está disponível e apenas 1 participante não pode.”

Essa explicação pode ser inicialmente baseada em template e dados, sem depender de LLM externa.

### 12.2 Eventos públicos

- data é fixa;
- não usam algoritmo de melhor data;
- inscrição deve respeitar capacidade;
- quando lotado, bloquear novas inscrições ou preparar waitlist futura, mas **não implementar waitlist agora**, salvo se for trivial e não complicar o MVP.

### 12.3 Convites

No MVP, aceite uma abordagem pragmática:
- convites por email ou link seguro;
- se envio transacional real atrasar o progresso, implemente primeiro por link compartilhável;
- documente o ponto de evolução para Resend/Twilio depois.

---

## 13. Modelagem de domínio sugerida

Você pode adaptar com critério, mas preserve a clareza do domínio.

### Entidades centrais

#### `users`
- id
- name
- email
- avatar_url
- created_at
- updated_at

#### `events`
- id
- owner_id
- type (`PRIVATE` | `PUBLIC`)
- title
- description
- location_text
- status (`DRAFT` | `OPEN` | `CONFIRMED` | `CANCELLED`)
- confirmed_date
- created_at
- updated_at

#### `private_event_settings`
- event_id
- date_window_start
- date_window_end
- key_person_user_id nullable
- key_person_weight

#### `event_participants`
- id
- event_id
- user_id nullable
- email nullable
- name_snapshot nullable
- role (`OWNER` | `INVITEE` | `KEY_PERSON`)
- invite_status (`PENDING` | `ACCEPTED` | `DECLINED`)

#### `availability_responses`
- id
- event_id
- participant_id
- date
- response (`YES` | `MAYBE` | `NO`)

#### `public_event_settings`
- event_id
- capacity
- visibility (`PUBLIC`)

#### `public_event_registrations`
- id
- event_id
- user_id
- status (`REGISTERED` | `CANCELLED`)
- created_at

### Observações de modelagem

- mantenha privado e público separados por regras, mas com base comum de `events`;
- não tente normalizar em excesso antes de entregar valor;
- preserve espaço para evolução futura sem criar complexidade prematura.

---

## 14. API e contratos

Defina contratos claros e tipados.

### Domínios mínimos da API

- auth/session
- users/profile
- private-events
- invites
- availability
- date-suggestion
- public-events
- registrations

### Regras

- validar input com Zod;
- não confiar em validação só do frontend;
- retornar erros claros e consistentes;
- tipar request/response sempre que possível;
- manter separação entre DTOs e domínio quando começar a doer, não antes.

---

## 15. Frontend: regras de implementação

### Regra 1
Não copiar protótipos JSX antigos para produção sem adaptação.

### Regra 2
Extrair o design system atual para uma implementação reaproveitável.

### Regra 3
Converter `colors_and_type.css` em fonte de verdade dos tokens do produto.

Crie um package de tokens e adapte para:
- Tailwind theme;
- CSS variables globais;
- componentes reutilizáveis.

### Regra 4
Use o design system existente como verdade para:
- cor;
- tipografia;
- spacing;
- shadows;
- motion;
- bordas;
- voice/copy.

### Regra 5
Não gere visual genérico de SaaS.

Evitar:
- gradientes azul-roxo genéricos;
- excesso de cards iguais;
- visual corporativo frio;
- emojis em controles;
- uso errado da cor de IA.

---

## 16. Regras de branding não negociáveis

Preserve a identidade do projeto.

### Cor
- Vermillion é a cor hero/primária
- Spark Yellow é **somente** para momentos de IA
- base visual em paper + ink

### Tipografia
- display: Bricolage Grotesque
- body/UI: Geist
- datas/dados: JetBrains Mono

### Voz
- humana, calorosa, conversacional;
- segunda pessoa;
- leve sabor latino;
- sem tom corporativo.

### Proibições
Não usar:
- gradientes bluish-purple;
- texto corporativo genérico;
- “seamless”, “effortless”, “empower”, “streamline”, “smart”;
- ALL CAPS fora de usos específicos;
- emoji como ícone de controle.

### Datas e números
- formato curto, glanceable;
- exemplo: `Tue, Jun 4`.

---

## 17. Acessibilidade, UX e qualidade

Todo código novo deve nascer com qualidade mínima profissional.

### Acessibilidade
- foco visível;
- contraste adequado;
- labels corretos;
- navegação por teclado nas áreas críticas;
- estados de erro claros.

### UX
- estados vazios bem tratados;
- estados de loading;
- estados de erro;
- microcopy coerente;
- feedback claro para ações críticas.

### Qualidade de engenharia
- TypeScript estrito;
- modularização sem exagero;
- sem duplicação gritante;
- sem mocks presos ao fluxo real;
- sem secrets hardcoded;
- sem dívidas ocultas não documentadas.

---

## 18. Testes mínimos obrigatórios

### Unitários
Cobrir no mínimo:
- algoritmo de melhor data;
- regras de desempate;
- confidence score;
- validações de capacidade;
- funções críticas de domínio.

### E2E / smoke
Cobrir no mínimo:
- signup/login;
- criar evento privado;
- marcar disponibilidade;
- gerar sugestão;
- confirmar data;
- criar evento público;
- inscrever-se.

Se o tempo apertar, prefira poucos testes realmente úteis a muitos testes frágeis.

---

## 19. Critérios de definição de pronto

Uma tarefa só está pronta se:

- funciona localmente;
- está integrada com a arquitetura proposta;
- segue o design system;
- está sem mock quebrando fluxo real;
- possui tratamento básico de erro;
- possui tipos e validação coerentes;
- não gera regressões óbvias;
- está documentada quando necessário.

O MVP só está pronto se:

- o fluxo privado completo funciona de ponta a ponta;
- o fluxo público básico funciona de ponta a ponta;
- o usuário consegue autenticar;
- o host/organizador consegue operar o essencial;
- o projeto sobe com instruções claras.

---

## 20. Como você deve trabalhar

### Modo de execução

Trabalhe em ciclos curtos.

Para cada macroetapa:
1. explique rapidamente o plano;
2. execute;
3. mostre o que foi criado;
4. aponte próximos passos.

### Evite perguntas desnecessárias

Não interrompa com perguntas amplas como:
- “como você quer que eu faça isso?”
- “qual arquitetura prefere?”
- “qual stack devo usar?”

As decisões principais já estão neste documento.

### Só pergunte quando houver bloqueio real

Exemplos legítimos:
- falta credencial necessária;
- conflito de produto que muda domínio;
- escolha irreversível sem evidência.

### Assuma com critério

Quando algo menor estiver indefinido:
- tome a decisão mais pragmática;
- registre em `docs/DECISIONS.md`.

---

## 21. Primeiras entregas concretas esperadas

Sua primeira execução deve produzir, nesta ordem:

### Entrega 1
Documentos base:
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/DECISIONS.md`

### Entrega 2
Foundation técnica:
- monorepo inicial;
- app web inicializado;
- API inicializada;
- lint/test/config;
- tokens integrados;
- layout base.

### Entrega 3
Core backend:
- schema inicial do banco;
- migrations;
- autenticação;
- modelos principais.

### Entrega 4
Primeiro fluxo vertical completo
Implemente primeiro o **modo privado** até funcionar de ponta a ponta, porque ele é o diferencial do produto.

Ordem interna recomendada:
1. criar evento privado;
2. convidar participantes;
3. marcar disponibilidade;
4. calcular melhor dia;
5. confirmar evento.

### Entrega 5
Segundo fluxo vertical
- criar evento público;
- listar;
- inscrever;
- controlar capacidade.

---

## 22. Guardrails para não errar o projeto

### Não faça agora
- app mobile completo;
- IA generativa desnecessária;
- features “legais” antes do core;
- mapas sofisticados;
- feed social;
- gamificação;
- refactors grandes sem valor imediato.

### Não simplifique demais
Também não reduza o projeto a:
- uma landing page;
- um CRUD genérico de eventos;
- um calendário sem domínio;
- um mock funcional sem persistência.

### O alvo correto
O alvo é um **MVP real**, pequeno mas honesto.

---

## 23. Entregáveis complementares importantes

Além do código, gere:

- `.env.example`
- `README.md` do projeto real com setup local
- instruções de seed/dev data se necessário
- scripts úteis no `package.json`
- documentação mínima de arquitetura

---

## 24. Revisão obrigatória antes de concluir qualquer ciclo

Revise e confirme:

### Produto
- privado e público estão corretamente separados?
- o MVP continua enxuto?
- nada fora de escopo entrou por acidente?

### Arquitetura
- estrutura está clara?
- domínio está coerente?
- nomeação está consistente?
- não há acoplamento desnecessário?

### Frontend
- design respeita tokens?
- amarelo de IA só aparece em momentos de IA?
- textos seguem a voz da marca?
- UI não parece template genérico?

### Backend
- validação existe?
- regras de negócio estão centralizadas?
- endpoints estão coerentes?
- dados críticos persistem corretamente?

### Qualidade
- testes mínimos passaram?
- erros básicos tratados?
- sem secrets no código?
- sem referências visíveis antigas a Farmei onde já deveria ser Farmei?

---

## 25. Prompt operacional final

Use o texto abaixo como instrução operacional principal da sua execução:

> Você está convertendo um projeto que hoje é design/protótipo em um MVP real e funcional chamado Farmei. Antes de implementar, leia os arquivos existentes, consolide PRD, arquitetura, backlog e decisões. Depois crie um monorepo enxuto com web + API, integre os tokens do design system, modele corretamente os domínios de eventos privados e públicos, implemente auth, banco e o algoritmo determinístico de melhor data. Priorize o fluxo privado ponta a ponta primeiro, depois o fluxo público. Não invente features fora do MVP. Não transforme o projeto em template SaaS genérico. Preserve rigorosamente branding, tipografia, cores, voz e regras do design system. Trabalhe em etapas curtas, documente decisões, entregue código limpo e mostre progresso real.

---

## 26. Primeira ação que você deve executar agora

1. Ler os arquivos existentes.
2. Criar `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md` e `docs/DECISIONS.md`.
3. Propor a estrutura inicial do monorepo.
4. Só depois começar a scaffoldar e implementar.

Comece agora.
