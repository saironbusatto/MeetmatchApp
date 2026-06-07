"use client";

import { T } from "./tokens";
import type { ButtonHTMLAttributes, CSSProperties, JSX } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const styles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "15px 24px",
    background: T.vermillion,
    color: T.white,
    border: `2px solid ${T.ink}`,
    borderRadius: 999,
    fontFamily: T.fontBody,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: T.stamp,
    transition: "box-shadow 0.1s, transform 0.1s",
    userSelect: "none",
  },
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 24px",
    background: T.white,
    color: T.ink,
    border: `2px solid ${T.ink}`,
    borderRadius: 999,
    fontFamily: T.fontBody,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: T.stamp,
    transition: "box-shadow 0.1s, transform 0.1s",
    userSelect: "none",
  },
  ghost: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 24px",
    background: "transparent",
    color: T.ink,
    border: `2px solid transparent`,
    borderRadius: 999,
    fontFamily: T.fontBody,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: "none",
    transition: "background 0.1s",
    userSelect: "none",
  },
};

export function PrimaryButton({ style, fullWidth, disabled, children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...styles.primary,
        ...(fullWidth ? { width: "100%" } : {}),
        ...(disabled ? { opacity: 0.5, cursor: "not-allowed", boxShadow: "none" } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ style, fullWidth, disabled, children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...styles.secondary,
        ...(fullWidth ? { width: "100%" } : {}),
        ...(disabled ? { opacity: 0.5, cursor: "not-allowed", boxShadow: "none" } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ style, fullWidth, disabled, children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...styles.ghost,
        ...(fullWidth ? { width: "100%" } : {}),
        ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
