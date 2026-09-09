"use client";

import { useRef, type CSSProperties, type JSX, type PointerEvent } from "react";
import { T } from "./tokens";

type QuorumValue = number | ((prev: number) => number);

interface QuorumStepperProps {
  value: number;
  onChange: (value: QuorumValue) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

/**
 * Stepper de quórum com botões +/−.
 * Clique: ±1. Segurar o botão: repete e acelera (sobe/desce rápido, "infinito").
 * Desce até `min` (padrão 1) e sobe até `max` (padrão bem alto).
 */
export function QuorumStepper({ value, onChange, min = 1, max = 9999, disabled = false }: QuorumStepperProps): JSX.Element {
  const repeatRef = useRef<{ timeout: ReturnType<typeof setTimeout> | null; interval: ReturnType<typeof setInterval> | null }>({ timeout: null, interval: null });

  function clamp(v: number) {
    return Math.min(max, Math.max(min, Math.round(v)));
  }

  function step(delta: number) {
    onChange(clamp(value + delta));
  }

  function clearRepeat() {
    const r = repeatRef.current;
    if (r.timeout !== null) clearTimeout(r.timeout);
    if (r.interval !== null) clearInterval(r.interval);
    r.timeout = null;
    r.interval = null;
  }

  function startRepeat(delta: number) {
    if (disabled) return;
    step(delta);
    clearRepeat();
    const r = repeatRef.current;
    r.timeout = setTimeout(() => {
      let speed = 110;
      const tick = () => {
        onChange((prev) => clamp(prev + delta));
        speed = Math.max(25, speed - 9);
        r.interval = setTimeout(tick, speed);
      };
      r.interval = setTimeout(tick, speed);
    }, 420);
  }

  function stopRepeat() {
    clearRepeat();
  }

  const btn: CSSProperties = {
    width: 46,
    height: 46,
    borderRadius: 12,
    border: `2px solid ${T.ink100}`,
    background: T.white,
    color: T.ink,
    fontFamily: T.fontBody,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
    userSelect: "none",
    touchAction: "manipulation",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const valueStyle: CSSProperties = {
    minWidth: 52,
    textAlign: "center",
    fontFamily: T.fontMono,
    fontSize: 20,
    fontWeight: 700,
    color: T.ink,
  };

  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;

  function handlePointerDown(e: PointerEvent<HTMLButtonElement>, delta: number) {
    if (disabled) return;
    e.preventDefault();
    startRepeat(delta);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        type="button"
        aria-label="Diminuir quórum mínimo"
        disabled={atMin}
        onPointerDown={(e) => handlePointerDown(e, -1)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        onContextMenu={(e) => e.preventDefault()}
        style={{ ...btn, opacity: atMin ? 0.35 : 1 }}
      >
        −
      </button>
      <span style={valueStyle} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar quórum mínimo"
        disabled={atMax}
        onPointerDown={(e) => handlePointerDown(e, 1)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        onContextMenu={(e) => e.preventDefault()}
        style={{ ...btn, opacity: atMax ? 0.35 : 1 }}
      >
        +
      </button>
    </div>
  );
}