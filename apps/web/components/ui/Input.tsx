"use client";

import { T } from "./tokens";
import type { InputHTMLAttributes, CSSProperties, JSX } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function StyledInput({ label, style, id, ...props }: InputProps): JSX.Element {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const inputStyle: CSSProperties = {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    background: T.white,
    border: `1.5px solid ${T.ink100}`,
    borderRadius: 14,
    fontFamily: T.fontBody,
    fontSize: 16,
    color: T.ink,
    outline: "none",
    boxSizing: "border-box",
    ...style,
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontFamily: T.fontBody,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: T.ink500,
    marginBottom: 6,
  };

  if (!label) {
    return <input id={inputId} style={inputStyle} {...props} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
      </label>
      <input id={inputId} style={inputStyle} {...props} />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function StyledSelect({ label, id, children, ...props }: SelectProps): JSX.Element {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const selectStyle: CSSProperties = {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    background: T.white,
    border: `1.5px solid ${T.ink100}`,
    borderRadius: 14,
    fontFamily: T.fontBody,
    fontSize: 16,
    color: T.ink,
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "none",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontFamily: T.fontBody,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: T.ink500,
    marginBottom: 6,
  };

  if (!label) {
    return (
      <select id={selectId} style={selectStyle} {...props}>
        {children}
      </select>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor={selectId} style={labelStyle}>
        {label}
      </label>
      <select id={selectId} style={selectStyle} {...props}>
        {children}
      </select>
    </div>
  );
}
