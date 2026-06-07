import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Nav } from "@/components/ui/Nav";
import type { JSX, ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
