import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #0a0a0a", background: "#FF3B2E", color: "#fff" }} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ padding: 10, borderRadius: 10, border: "1px solid #D4D1C8" }} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ padding: 10, borderRadius: 10, border: "1px solid #D4D1C8" }} />;
}

export function Card({ children }: { children: ReactNode }) {
  return <div style={{ border: "1px solid #E8E6E0", borderRadius: 12, padding: 16, background: "#fff" }}>{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span style={{ borderRadius: 999, padding: "4px 10px", background: "#FFF1EE", color: "#BC1809" }}>{children}</span>;
}

export function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((x) => x[0]).join("").slice(0,2).toUpperCase();
  return <span aria-label="avatar" style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#FF3B2E", color: "#fff" }}>{initials}</span>;
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return <div style={{ width: "100%", background: "#F4F2EC", borderRadius: 999 }}><div style={{ width: `${pct}%`, background: "#FF3B2E", borderRadius: 999, height: 8 }} /></div>;
}

export function AvailabilityButton({ state, onClick }: { state: "YES" | "MAYBE" | "NO"; onClick?: () => void }) {
  const bg = state === "YES" ? "#D7F3E2" : state === "MAYBE" ? "#FFF4BD" : "#FFD9D2";
  return <button onClick={onClick} style={{ borderRadius: 10, padding: "8px 12px", border: "1px solid #0a0a0a", background: bg }}>{state}</button>;
}

export function EventCard({ title, subtitle }: { title: string; subtitle: string }) {
  return <Card><h3>{title}</h3><p>{subtitle}</p></Card>;
}

export function AppHeader({ title }: { title: string }) {
  return <header style={{ padding: "12px 0" }}><h2>{title}</h2></header>;
}

export function Modal({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "grid", placeItems: "center" }}><div style={{ background: "#fff", borderRadius: 12, padding: 16 }}>{children}</div></div>;
}
