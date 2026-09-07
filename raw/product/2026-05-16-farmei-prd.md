# Farmei PRD — Product Requirements Document

> Source: docs/PRD.md (internal project document)
> Collected: 2026-05-16
> Published: 2026-05-16

O Farmei é uma plataforma de eventos com dois modos principais:

1. **Eventos privados com grupo** — organizador cria evento, convida pessoas, define janela de datas e pessoa-chave opcional. Convidados informam disponibilidade; sistema sugere melhor data com pontuação ponderada.

2. **Eventos públicos** — hosts criam eventos com data fixa, vagas e local. Usuários descobrem, visualizam quem vai e se inscrevem.

## Problema

Marcar eventos em grupo é demorado e confuso. WhatsApp + enquetes improvisadas = fricção. Eventos públicos locais têm descoberta ruim, pouca visibilidade social e ambiguidade sobre lotação.

## Objetivo

- Reduzir tempo para marcar eventos privados em grupo
- Aumentar taxa de confirmação de eventos privados
- Facilitar descoberta e inscrição em eventos públicos locais
- Criar experiência social com forte apelo visual e simplicidade

## Público-alvo

**Primário:** Pessoas 20–40 anos que organizam encontros sociais, esportivos ou de trabalho informal. Pequenos hosts locais (bares, quadras, espaços).

**Secundário:** Times pequenos, grupos de amigos recorrentes, comunidades locais.

## Proposta de valor

- Privado: "Convide a galera, cada um marca quando pode, e o Farmei sugere a melhor data."
- Público: "Descubra o que está rolando perto de você e entre nos eventos com clareza de lotação e contexto social."

## Escopo do MVP

1. Cadastro e autenticação por email/senha
2. Criação de evento privado
3. Convite de participantes
4. Registro de disponibilidade por participante
5. Cálculo da melhor data com lógica ponderada
6. Visualização da sugestão com explicação simples
7. Confirmação da data final
8. Criação de evento público por host
9. Listagem de eventos públicos
10. Inscrição em evento público
11. Controle de lotação máxima
12. Painel básico do host com lista de inscritos

## Fora do MVP

Instagram OAuth, crush finder, mapa geolocalização real, calendar sync, push notifications, feed/stories, IA generativa, QR code check-in, pagamentos.

## Jornadas principais

**A — Criar evento privado:** Login → criar evento → definir janela+key person → adicionar convidados → enviar convites → convidados marcam disponibilidade → sistema calcula → organizador confirma.

**B — Participar evento privado:** Recebe convite → abre evento → marca disponibilidade → recebe resultado final.

**C — Descobrir evento público:** Feed → filtro → detalhe → vê vagas + quem vai → inscrição → confirmação.

**D — Host criar evento público:** Login → cria evento data fixa → define local/capacidade/categoria → publica → acompanha inscrições.

## Regras de negócio

### Eventos privados
- Pesos: yes=1.0, maybe=0.5, no=0
- Key person tem multiplicador configurável (default 3x)
- Maior soma ponderada vence; empate: data mais cedo
- Confidence = score_dia / score_máximo_possível
- Sistema gera justificativa textual simples

### Eventos públicos
- Data fixa, sem cálculo de melhor data
- Inscrições bloqueadas ao atingir capacidade máxima
- Host visualiza e exporta lista de inscritos

## Métricas de sucesso

Produto: taxa de criação→confirmação evento privado, tempo médio até definição da data, taxa de resposta dos convidados, taxa de inscrição/ocupação eventos públicos.

Engenharia: tempo de carregamento inicial, taxa de erro em cálculo de disponibilidade, taxa de falha em auth/convites.

## Riscos

- Dois produtos no mesmo app pode gerar confusão
- Escopo social pode crescer antes do core funcionar
- Rebrand incompleto Farmei→Farmei pode poluir código
- Convites, auth e permissões precisam ser bem definidos desde o início

## Decisões pendentes

- Convidados precisam criar conta para responder disponibilidade?
- MVP terá web, mobile ou ambos?
- Convites: email, link mágico, SMS ou combinação?
- Haverá papel separado de host/admin?
- App em português como idioma único inicial?
