import Link from "next/link";
import { T } from "@/components/ui/tokens";
import type { CSSProperties, JSX } from "react";

export default function HomePage(): JSX.Element {
  const heroStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    maxWidth: 1024,
    margin: "0 auto",
    padding: "80px 24px 64px",
  };

  const circleStyle: CSSProperties = {
    position: "absolute",
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: T.vermillion,
    opacity: 0.08,
    pointerEvents: "none",
  };

  const circleSmStyle: CSSProperties = {
    position: "absolute",
    bottom: 40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: "50%",
    background: T.spark,
    opacity: 0.12,
    pointerEvents: "none",
  };

  const eyebrowStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: T.vermillion,
    marginBottom: 20,
  };

  const headlineStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: "clamp(48px, 7vw, 72px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: T.ink,
    marginBottom: 24,
    maxWidth: 680,
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 20,
    color: T.ink500,
    lineHeight: 1.6,
    maxWidth: 500,
    marginBottom: 40,
  };

  const ctaRowStyle: CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const primaryCtaStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px 28px",
    background: T.vermillion,
    color: T.white,
    border: `2px solid ${T.ink}`,
    borderRadius: 999,
    fontFamily: T.fontBody,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: T.stamp,
  };

  const ghostCtaStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 28px",
    background: "transparent",
    color: T.ink,
    border: `2px solid transparent`,
    borderRadius: 999,
    fontFamily: T.fontBody,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
  };

  const featuresStyle: CSSProperties = {
    maxWidth: 1024,
    margin: "0 auto",
    padding: "0 24px 80px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  };

  const featureCardStyle: CSSProperties = {
    background: T.white,
    border: `1px solid ${T.ink100}`,
    borderRadius: 20,
    padding: 28,
    boxShadow: T.stamp,
  };

  const iconStyle: CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    marginBottom: 16,
    border: `1.5px solid ${T.ink100}`,
    background: T.ink50,
  };

  const featureTitleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 20,
    fontWeight: 700,
    color: T.ink,
    marginBottom: 8,
  };

  const featureDescStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 15,
    color: T.ink500,
    lineHeight: 1.6,
  };

  return (
    <>
      <section style={heroStyle}>
        <div style={circleStyle} />
        <div style={circleSmStyle} />
        <p style={eyebrowStyle}>Eventos sem fricção</p>
        <h1 style={headlineStyle}>
          Let&apos;s find a time<br />that works.
        </h1>
        <p style={subtitleStyle}>
          Planeje eventos privados com IA ou crie eventos públicos com lotação em tempo real.
          Simples assim.
        </p>
        <div style={ctaRowStyle}>
          <Link href="/signup" style={primaryCtaStyle}>
            Criar conta
          </Link>
          <Link href="/login" style={ghostCtaStyle}>
            Já tenho conta
          </Link>
        </div>
      </section>

      <div style={featuresStyle}>
        <div style={featureCardStyle}>
          <div style={iconStyle}>🗓</div>
          <h3 style={featureTitleStyle}>IA escolhe a melhor data</h3>
          <p style={featureDescStyle}>
            Convide participantes, cada um marca sua disponibilidade. A IA cruza tudo e
            sugere o melhor dia — com peso especial pra quem não pode faltar.
          </p>
        </div>
        <div style={featureCardStyle}>
          <div style={iconStyle}>🎟</div>
          <h3 style={featureTitleStyle}>Eventos públicos com lotação</h3>
          <p style={featureDescStyle}>
            Crie eventos abertos, defina a capacidade máxima e veja a barra de ocupação
            crescer em tempo real. Perfeito pra quadras, bares e shows.
          </p>
        </div>
        <div style={{ ...featureCardStyle, background: T.paper, boxShadow: T.stampAi, borderColor: T.spark }}>
          <div style={{ ...iconStyle, background: T.spark, borderColor: T.spark }}>✨</div>
          <h3 style={featureTitleStyle}>Visibilidade social</h3>
          <p style={featureDescStyle}>
            Saiba quem da sua rede vai ao mesmo evento. Nunca mais chegue num rolê sem
            conhecer ninguém.
          </p>
        </div>
      </div>
    </>
  );
}
