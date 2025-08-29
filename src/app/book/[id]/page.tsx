import Image from "next/image";
import { getBook } from "@/lib/googleBooks";

type Props = {
  params: { id: string };
};

export default async function BookPage({ params }: Props) {
  const { id } = params; // directo, sin await
  const book = await getBook(id);

  const v = book?.volumeInfo ?? {};
  const raw =
    v.imageLinks?.large ||
    v.imageLinks?.medium ||
    v.imageLinks?.thumbnail ||
    v.imageLinks?.smallThumbnail ||
    v.imageLinks?.largeThumbnail ||
    "";
  const img = typeof raw === "string" ? raw.replace(/^http:\/\//, "https://") : "";

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
            />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{v.title}</h1>
          {v.authors?.length ? (
            <p className="text-muted-foreground">por {v.authors.join(", ")}</p>
          ) : null}
          {v.publishedDate ? (
            <p className="text-sm text-muted-foreground">Publicado: {v.publishedDate}</p>
          ) : null}
          {v.description ? (
            <p className="text-sm leading-6">{v.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Sin descripción.</p>
          )}
        </div>
      </div>
    </section>
  );
}
