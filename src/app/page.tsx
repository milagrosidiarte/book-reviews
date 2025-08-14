"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function go() {
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
   <section className="space-y-6 py-10">
      <h1 className="text-3xl font-bold">Descubrí libros</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Título, autor o ISBN…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
        />
        <Button onClick={go}>Buscar</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Ejemplos: <button onClick={() => setQ("harry potter")} className="underline">harry potter</button> ·
        <button onClick={() => setQ("inauthor:rowling")} className="underline ml-1">inauthor:rowling</button> ·
        <button onClick={() => setQ("isbn:9780439708180")} className="underline ml-1">isbn:9780439708180</button>
      </p>
      <Link href="/about" className="text-sm underline">Sobre el proyecto</Link>
    </section>
  );
}
