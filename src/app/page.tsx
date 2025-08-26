import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6 py-10">
      <h1 className="text-3xl font-bold">Descubrí libros</h1>

      {/* Formulario server-side */}
      <form action="/search" method="get" className="flex gap-2">
        <input
          type="text"
          name="q"
          placeholder="Título, autor o ISBN…"
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        Ejemplos:{" "}
        <a href="/search?q=harry+potter" className="underline">
          harry potter
        </a>{" "}
        ·
        <a href="/search?q=inauthor:rowling" className="underline ml-1">
          inauthor:rowling
        </a>{" "}
        ·
        <a href="/search?q=isbn:9780439708180" className="underline ml-1">
          isbn:9780439708180
        </a>
      </p>

      {/* <Link href="/about" className="text-sm underline">
        Sobre el proyecto
      </Link> */}
    </section>
  );
}
