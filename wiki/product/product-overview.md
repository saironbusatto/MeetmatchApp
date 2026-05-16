# Product Overview — Farmei

> Sources: Internal PRD, 2026-05-16
> Raw: [Farmei PRD](../../raw/product/2026-05-16-farmei-prd.md)

## Overview

Farmei é uma plataforma de eventos sociais com dois modos distintos que convivem no mesmo produto: agendamento colaborativo privado (com sugestão inteligente de data) e descoberta de eventos públicos (com inscrição e controle de lotação). O produto deve transmitir calor, leveza e socialidade — nunca parecer uma agenda corporativa.

## Dois modos, um produto

O ponto de tensão central do design é que esses dois modos têm dinâmicas completamente diferentes e **não devem ser misturados em domínio ou regra de negócio**.

| Dimensão | Evento privado | Evento público |
|----------|---------------|----------------|
| Data | Definida por algoritmo | Fixa desde a criação |
| Acesso | Convidados específicos | Qualquer usuário |
| Ação principal | Marcar disponibilidade | Se inscrever |
| "IA" | Sim (algoritmo de peso) | Não |
| Lotação | Sem limite formal no MVP | Capacidade máxima |

## Público-alvo

**Primário:** Pessoas 20–40 anos organizando encontros sociais, esportivos ou de trabalho informal. Pequenos hosts locais (bares, quadras, produtores independentes).

**Secundário:** Times pequenos, grupos de amigos recorrentes, comunidades locais com eventos de baixa/média complexidade.

## Proposta de valor central

- **Para o organizador privado:** eliminar o ciclo WhatsApp → enquete → debate → sem resultado. Cada um marca quando pode; o sistema escolhe.
- **Para o participante público:** clareza de lotação, contexto social (quem vai) e inscrição em poucos taps.

## Jornadas principais

### A — Fluxo privado (organizador)
Login → criar evento → definir janela de datas + key person → convidar participantes → aguardar disponibilidades → solicitar sugestão → revisar card com melhor data + confidence + explicação → confirmar data.

### B — Fluxo privado (convidado)
Recebe link de convite → abre evento → marca cada dia (yes/maybe/no) → aguarda resultado → recebe data confirmada.

### C — Fluxo público (usuário)
Feed de eventos → filtrar → abrir detalhe (data, local, vagas restantes, quem vai) → inscrever-se → confirmação.

### D — Fluxo público (host)
Login → criar evento com data fixa, capacidade, local, categoria → publicar → acompanhar inscrições → exportar lista de inscritos.

## Métricas de sucesso (produto)

- Taxa criação→confirmação de evento privado
- Tempo médio até definição da data
- Taxa de resposta dos convidados
- Taxa de inscrição e ocupação em eventos públicos

## See Also

- [Business Rules](business-rules.md)
- [System Design](../architecture/system-design.md)
