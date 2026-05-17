import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <main>
      <h1>Farmei</h1>
      <p>Planeje eventos privados e públicos sem fricção.</p>
      <div className="grid">
        <Link href="/login">Entrar</Link>
        <Link href="/signup">Criar conta</Link>
        <Link href="/public">Ver eventos públicos</Link>
      </div>
    </main>
  );
}
