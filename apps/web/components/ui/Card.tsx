import { T } from "./tokens";
import type { CSSProperties, HTMLAttributes, JSX } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: number;
  noShadow?: boolean;
}

export function Card({ style, padding = 24, noShadow = false, children, ...props }: CardProps): JSX.Element {
  const cardStyle: CSSProperties = {
    background: T.white,
    border: `1px solid ${T.ink100}`,
    borderRadius: 20,
    padding,
    boxShadow: noShadow ? "none" : T.stamp,
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
}
