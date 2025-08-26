import Image from "next/image";
import { getBook } from "@/lib/googleBooks";
import ReviewSection from "@/components/ui/ReviewSection";
import DOMPurify from "isomorphic-dompurify";

export default async function BookPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const book = await getBook(id);

  const v = book.volumeInfo ?? {};
  const raw =
    v.imageLinks?.large ||
    v.imageLinks?.medium ||
    v.imageLinks?.thumbnail ||
    v.imageLinks?.largeThumbnail ||
    "";
  const img = raw.replace(/^http:\/\//, "https://");

  // 🔹 Sanitizamos la descripción para evitar HTML malformado
  const safeDescription = v.description
    ? DOMPurify.sanitize(v.description)
    : "";

  return (
    <section className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-44 h-64 bg-muted rounded-md overflow-hidden shrink-0">
          {img && (
            <Image
              src={img}
              alt={v.title || "cover"}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{v.title}</h1>
          <p className="text-muted-foreground">
            {v.authors?.join(", ") || "Autor desconocido"}
          </p>
          <div className="text-sm text-muted-foreground space-x-2">
            {v.publishedDate && <span>Publicado: {v.publishedDate}</span>}
            {v.publisher && <span>· {v.publisher}</span>}
            {v.pageCount && <span>· {v.pageCount} págs.</span>}
            {v.categories?.length ? (
              <span>· {v.categories.join(", ")}</span>
            ) : null}
          </div>
        </div>
      </div>

      {safeDescription && (
        <article className="prose max-w-none">
          <h2>Descripción</h2>
          <p
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: safeDescription }}
          />
        </article>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>
        <ReviewSection bookId={book.id} />
      </section>
    </section>
  );
}
