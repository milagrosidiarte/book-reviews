import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchBooks } from "@/lib/googleBooks";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").trim();
  const items = q ? await searchBooks(q) : [];

  return (
    <section className="space-y-6 py-6">
      <h2 className="text-2xl font-semibold">
        {q ? <>Resultados para “{q}”</> : "Sin búsqueda"}
      </h2>

      {!q ? (
        <p className="text-muted-foreground">
          Volvé al Home e ingresá una consulta.
        </p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No se encontraron libros.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((b: any) => {
            const v = b.volumeInfo ?? {};
            const raw =
              v.imageLinks?.large ||
              v.imageLinks?.medium ||
              v.imageLinks?.thumbnail ||
              v.imageLinks?.smallThumbnail ||
              "";
            const img = raw.replace(/^http:\/\//, "https://");

            return (
              <Card key={b.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{v.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {v.authors?.join(", ") || "Autor desconocido"}
                  </p>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <div className="relative w-20 h-28 bg-muted rounded-md overflow-hidden shrink-0">
                    {img && (
                      <Image
                        src={img}
                        alt={v.title || "cover"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="line-clamp-3">{v.description}</p>
                    <Link
                      href={`/book/${b.id}`}
                      className="underline mt-2 inline-block"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
