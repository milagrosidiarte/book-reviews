import Image from "next/image";
import { getBook } from "@/lib/googleBooks";

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  const v = book.volumeInfo ?? {};
  const img = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail;

  return (
    <section className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-44 h-64 bg-muted rounded-md overflow-hidden shrink-0">
          {img && <Image src={img} alt={v.title || "cover"} fill className="object-cover" />}
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
            {v.categories?.length ? <span>· {v.categories.join(", ")}</span> : null}
          </div>
        </div>
      </div>

      {v.description && (
        <article className="prose max-w-none">
          <h2>Descripción</h2>
          {/* Google Books puede traer HTML, por eso innerHTML */}
          <p dangerouslySetInnerHTML={{ __html: v.description }} />
        </article>
      )}
    </section>
  );
}
