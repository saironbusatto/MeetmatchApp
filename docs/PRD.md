# PRD — Farmei

## 1. Visão geral

Farmei é uma plataforma de eventos com dois modos principais:

1. **Eventos privados com grupo**  
   Um organizador cria um evento, convida pessoas específicas, define uma janela de datas e uma pessoa-chave opcional. Os convidados informam disponibilidade, e o sistema sugere a melhor data com base em uma pontuação ponderada.

2. **Eventos públicos / o que está rolando**  
   Hosts criam eventos com data fixa, número máximo de vagas e informações do local. Usuários podem descobrir eventos, visualizar quem vai e se inscrever.

O produto deve transmitir uma experiência social, calorosa e leve, sem parecer uma agenda corporativa. A identidade visual e verbal já está definida no design system existente.

## 2. Problema

Marcar eventos em grupo é demorado e confuso. Conversas em WhatsApp, enquetes improvisadas e agendas desalinhadas fazem com que o processo de escolher uma data vire fricção.

Além disso, eventos públicos locais muitas vezes têm descoberta ruim, pouca visibilidade social e pouca clareza sobre lotação e interesse das pessoas.

## 3. Objetivo do produto

O Farmei deve:

- reduzir o tempo necessário para marcar eventos privados em grupo;
- aumentar a taxa de confirmação de eventos privados;
- facilitar descoberta e inscrição em eventos públicos locais;
- criar uma experiência social com forte apelo visual e simplicidade de uso.

## 4. Público-alvo

### Primário
- Pessoas de 20 a 40 anos que organizam encontros sociais, esportivos ou de trabalho informal.
- Pequenos hosts e organizadores locais, como bares, quadras, produtores independentes e espaços sociais.

### Secundário
- Times pequenos que precisam combinar encontros rápidos.
- Grupos de amigos recorrentes.
- Comunidades locais com eventos de baixa ou média complexidade.

## 5. Proposta de valor

### Para eventos privados
“Convide a galera, cada um marca quando pode, e o Farmei sugere a melhor data.”

### Para eventos públicos
“Descubra o que está rolando perto de você e entre nos eventos com clareza de lotação e contexto social.”

## 6. Escopo do MVP

O MVP deve incluir:

1. Cadastro e autenticação por email/senha.
2. Criação de evento privado.
3. Convite de participantes para evento privado.
4. Registro de disponibilidade por participante.
5. Cálculo da melhor data com lógica ponderada.
6. Visualização da sugestão com explicação simples.
7. Confirmação da data final do evento privado.
8. Criação de evento público por host.
9. Listagem de eventos públicos.
10. Inscrição em evento público.
11. Controle de lotação máxima.
12. Painel básico do host com lista de inscritos.

## 7. Fora do MVP

Esses itens ficam para fases posteriores:

- Instagram OAuth.
- Crush finder.
- Mapa com geolocalização real.
- Sincronização com calendário externo.
- Push notifications.
- Feed/stories de evento.
- Recomendação personalizada com IA generativa.
- Check-in avançado com QR code.
- Pagamentos e ticketing.

## 8. Jornadas principais

### Jornada A — Criar evento privado
1. Usuário faz login.
2. Clica em criar evento.
3. Informa título, descrição, janela de datas, local opcional, pessoa-chave opcional.
4. Adiciona convidados.
5. Envia convites.
6. Convidados marcam disponibilidade.
7. Sistema calcula melhor data.
8. Organizador revisa a sugestão.
9. Organizador confirma a data final.
10. Sistema envia atualização aos participantes.

### Jornada B — Participar de evento privado
1. Usuário recebe convite.
2. Abre evento.
3. Marca disponibilidade por dia.
4. Visualiza status do grupo, quando permitido.
5. Recebe resultado final.
6. Confirma presença ou acompanha detalhes.

### Jornada C — Descobrir evento público
1. Usuário acessa feed/lista de eventos.
2. Filtra por data, tipo ou localização.
3. Abre detalhes do evento.
4. Vê vagas, horário, local e quem vai.
5. Realiza inscrição.
6. Recebe confirmação.

### Jornada D — Host criar evento público
1. Host faz login.
2. Cria evento com data fixa.
3. Define local, capacidade, categoria e descrição.
4. Publica o evento.
5. Acompanha inscrições.
6. Exporta lista de inscritos.

## 9. Regras de negócio

### 9.1 Eventos privados
- O organizador define uma janela de datas permitidas.
- Cada participante marca disponibilidade por dia.
- Os estados permitidos são:
  - `yes` = peso 1.0
  - `maybe` = peso 0.5
  - `no` = peso 0
- Uma pessoa-chave opcional pode receber multiplicador de peso.
- O sistema avalia todos os dias dentro da janela.
- A data com maior soma ponderada vence.
- Em caso de empate, vence a data mais cedo.
- O sistema calcula um confidence score:
  - `score_dia / score_maximo_possivel`
- O sistema deve mostrar uma justificativa simples da sugestão.

### 9.2 Eventos públicos
- Eventos públicos têm data fixa.
- Não usam cálculo de melhor data.
- Cada evento possui capacidade máxima.
- O sistema deve impedir inscrições acima do limite.
- O host pode visualizar lista de inscritos.
- O host pode exportar lista de inscritos.

## 10. Requisitos funcionais

### Auth e conta
- Cadastro com email e senha.
- Login e logout.
- Recuperação de senha.
- Perfil básico do usuário.

### Eventos privados
- Criar, editar e cancelar evento privado.
- Adicionar/remover convidados.
- Definir pessoa-chave.
- Coletar disponibilidade por data.
- Calcular melhor data.
- Exibir resultado.
- Confirmar data final.
- Notificar convidados.

### Eventos públicos
- Criar, editar e cancelar evento público.
- Explorar eventos publicados.
- Ver detalhes do evento.
- Inscrever-se e cancelar inscrição.
- Visualizar lotação.
- Painel do host com inscritos.

### Admin/host
- Gerenciar eventos criados.
- Exportar inscritos em CSV.
- Ver métricas simples por evento.

## 11. Requisitos não funcionais

- Interface mobile-first.
- Web app com boa responsividade.
- Performance adequada para uso em redes móveis.
- Acessibilidade mínima com foco visível, contraste e navegação por teclado no web.
- Logs de erros no backend.
- Auditoria básica de ações críticas.
- Arquitetura preparada para evolução incremental.

## 12. UX e branding

A implementação deve respeitar o design system existente:

- cor hero vermillion `#FF3B2E` usada com moderação;
- cor de IA spark yellow `#FFD93D` apenas em momentos de IA;
- tipografia com Bricolage Grotesque, Geist e JetBrains Mono;
- voz conversacional, quente, humana e sem tom corporativo;
- evitar gradientes bluish-purple, excesso de cor e emojis em controles.

## 13. Métricas de sucesso

### Produto
- Taxa de criação → confirmação de evento privado.
- Tempo médio até definição da data.
- Taxa de resposta dos convidados.
- Taxa de inscrição em eventos públicos.
- Taxa de ocupação por evento público.

### Engenharia
- Tempo de carregamento inicial.
- Taxa de erro em cálculo de disponibilidade.
- Taxa de falha em autenticação e envio de convites.

## 14. Stack sugerida

### Frontend web
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui

### Mobile
- Expo / React Native
- Expo Router
- NativeWind

### Backend
- Node.js com Hono ou alternativa equivalente
- PostgreSQL
- Auth via Clerk ou Supabase Auth
- Storage via Supabase Storage ou Cloudflare R2

### Deploy
- Web: Vercel
- Mobile: Expo EAS
- CI/CD: GitHub Actions

## 15. Estrutura inicial sugerida

```txt
/apps
  /web
  /mobile
/packages
  /ui
  /config
  /design-tokens
  /types
  /utils
/services
  /api
/docs
  PRD.md
  architecture.md
  user-flows.md
```

## 16. Fases de entrega

### Fase 1 — MVP
- Auth
- Evento privado
- Convites
- Disponibilidade
- Sugestão de data
- Confirmação
- Evento público simples
- Inscrição
- Painel básico de host

### Fase 2
- Exportação de inscritos
- Mapa
- Melhorias sociais
- Calendar sync

### Fase 3
- Instagram OAuth
- Crush finder
- Feed/stories
- Push notifications

## 17. Riscos

- Mistura de dois produtos em uma mesma experiência pode gerar confusão.
- Escopo social pode crescer rápido demais antes do core funcionar.
- Rebrand incompleto entre Farmei e Farmei pode poluir código e documentação.
- Convites, auth e permissões precisam ser bem definidos desde o início.

## 18. Decisões pendentes

- Nome final oficial em todos os ambientes: Farmei?
- MVP terá web, mobile ou ambos?
- Convidados precisam criar conta para responder disponibilidade?
- Eventos públicos terão geolocalização no MVP?
- Haverá papel separado de host/admin?
- Convites serão por email, link mágico, SMS ou combinação?
- O app terá português como idioma inicial único?