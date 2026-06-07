import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Nav } from "@/components/ui/Nav";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
