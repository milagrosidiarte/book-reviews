import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getBook } from "@/lib/googleBooks";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Vote from "@/models/Vote";
import Favorite from "@/models/Favorite";
import type { IReview } from "@/models/Review";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

// ============== Server Actions ==============

// Crear/actualizar TU reseña (upsert)
async function upsertReviewAction(volumeId: string, formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?next=/book/${volumeId}`);

  const schema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    title: z.string().max(120).optional(),
    body: z.string().max(5000).optional(),
  });

  const parsed = schema.safeParse({
    rating: formData.get("rating"),
    title: (formData.get("title") as string) || undefined,
    body: (formData.get("body") as string) || undefined,
  });
  if (!parsed.success) return;

  await connectDB();
  await Review.findOneAndUpdate(
    { userId: session.user.id, volumeId },
    parsed.data,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  revalidatePath(`/book/${volumeId}`);
}

// Borrar TU reseña
async function deleteReviewAction(volumeId: string, reviewId: string) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?next=/book/${volumeId}`);

  await connectDB();
  // Solo borra si sos el dueño
  await Review.findOneAndDelete({ _id: reviewId, userId: session.user.id });

  revalidatePath(`/book/${volumeId}`);
}

// Votar (+1/-1) una reseña
async function voteAction(volumeId: string, reviewId: string, dir: "up" | "down") {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?next=/book/${volumeId}`);

  await connectDB();
  const value = dir === "up" ? 1 : -1;
  await Vote.findOneAndUpdate(
    { reviewId, userId: session.user.id },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  revalidatePath(`/book/${volumeId}`);
}

// Toggle de favorito para ESTE libro
async function toggleFavoriteAction(volumeId: string) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?next=/book/${volumeId}`);

  await connectDB();
  const existed = await Favorite.findOne({ userId: session.user.id, volumeId });
  if (existed) {
    await Favorite.deleteOne({ _id: existed._id });
  } else {
    await Favorite.create({ userId: session.user.id, volumeId });
  }

  revalidatePath(`/book/${volumeId}`);
}

// ============== Page (SSR) ==============
export default async function BookPage({ params }: Props) {
  const { id } = await params; // Google Books volumeId
  const session = await auth();

  // 1) Google Books (SSR)
  const book = await getBook(id);
  const v = book?.volumeInfo ?? {};
  const raw =
    v.imageLinks?.large ||
    v.imageLinks?.medium ||
    v.imageLinks?.thumbnail ||
    v.imageLinks?.largeThumbnail ||
    "";
  const img = raw ? raw.replace(/^http:\/\//, "https://") : "";

  // 2) Mongo (SSR)
  await connectDB();

  // Reseñas del libro
  const reviews = await Review.find({ volumeId: id })
    .sort({ createdAt: -1 })
    .lean<IReview[]>();

  // Tu reseña (para prellenar el form)
  const myReview: IReview | null = session?.user?.id
    ? await Review.findOne({ volumeId: id, userId: session.user.id }).lean<IReview | null>()
    : null;

  // ¿Es favorito este libro para el usuario?
  const isFav =
    session?.user?.id
      ? !!(await Favorite.findOne({ userId: session.user.id, volumeId: id }).lean())
      : false;

  // Votos agregados y tu voto
  type VoteAgg = { _id: any; score: number; up: number; down: number };
  type VoteDoc = { reviewId: any; value: 1 | -1 };

  const reviewIds = reviews.map((r) => r._id);
  let scoreMap = new Map<string, { score: number; up: number; down: number }>();
  let myVoteMap = new Map<string, 1 | -1>();

  if (reviewIds.length > 0) {
    const [agg, myVotes] = await Promise.all([
      Vote.aggregate<VoteAgg>([
        { $match: { reviewId: { $in: reviewIds } } },
        {
          $group: {
            _id: "$reviewId",
            score: { $sum: "$value" },
            up: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
            down: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } },
          },
        },
      ]),
      session?.user?.id
        ? Vote.find({ userId: session.user.id, reviewId: { $in: reviewIds } }).lean<VoteDoc[]>()
        : Promise.resolve([] as VoteDoc[]),
    ]);

    for (const a of agg) {
      scoreMap.set(String(a._id), { score: a.score ?? 0, up: a.up ?? 0, down: a.down ?? 0 });
    }
    for (const mv of myVotes) {
      myVoteMap.set(String(mv.reviewId), mv.value);
    }
  }

  return (
    <section className="space-y-6 py-6">
      {/* Cabecera libro */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-44 h-64 bg-muted rounded-md overflow-hidden shrink-0">
          {img && <Image src={img} alt={v.title || "cover"} fill className="object-cover" />}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">{v.title}</h1>
          <p className="text-muted-foreground">{v.authors?.join(", ") || "Autor desconocido"}</p>
          <div className="text-sm text-muted-foreground space-x-2">
            {v.publishedDate && <span>Publicado: {v.publishedDate}</span>}
            {v.publisher && <span>· {v.publisher}</span>}
            {v.pageCount && <span>· {v.pageCount} págs.</span>}
            {v.categories?.length ? <span>· {v.categories.join(", ")}</span> : null}
          </div>

          {/* Botón Favorito */}
          {session?.user?.id ? (
            <form action={toggleFavoriteAction.bind(null, id)}>
              <Button type="submit" variant={isFav ? "secondary" : "outline"} size="sm">
                {isFav ? "Quitar de Favoritos" : "Agregar a Favoritos"}
              </Button>
            </form>
          ) : (
            <Button asChild variant="link" size="sm">
              <Link href={`/login?next=/book/${id}`}>Iniciá sesión para guardar en Favoritos</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Descripción */}
      {v.description && (
        <article className="prose max-w-none">
          <h2>Descripción</h2>
          <p dangerouslySetInnerHTML={{ __html: v.description }} />
        </article>
      )}

      {/* Reseñas */}
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Reseñas</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sé el primero en reseñar este libro.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => {
              const key = String(r._id);
              const stats = scoreMap.get(key) ?? { score: 0, up: 0, down: 0 };
              const myVote = myVoteMap.get(key); // 1 | -1 | undefined
              const itsMine = session?.user?.id && String(r.userId) === session.user.id;

              return (
                <li key={key} className="border rounded p-3 space-y-2">
                  <div className="font-medium">
                    {r.title || "(sin título)"} — {r.rating}/5
                  </div>
                  {r.body && <p className="text-sm">{r.body}</p>}

                  {/* Acciones: Votos + (si es tuya) Editar/Borrar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Puntuación: {stats.score} ({stats.up}↑ / {stats.down}↓)
                    </span>

                    {session?.user?.id ? (
                      <>
                        <form action={voteAction.bind(null, id, key, "up")}>
                          <Button
                            type="submit"
                            size="sm"
                            variant={myVote === 1 ? "secondary" : "outline"}
                            aria-label="Votar positivo"
                            title="Votar positivo"
                          >
                            👍
                          </Button>
                        </form>
                        <form action={voteAction.bind(null, id, key, "down")}>
                          <Button
                            type="submit"
                            size="sm"
                            variant={myVote === -1 ? "destructive" : "outline"}
                            aria-label="Votar negativo"
                            title="Votar negativo"
                          >
                            👎
                          </Button>
                        </form>
                      </>
                    ) : (
                      <Button asChild variant="link" size="sm">
                        <Link href={`/login?next=/book/${id}`}>Iniciá sesión para votar</Link>
                      </Button>
                    )}

                    {itsMine && (
                      <>
                        {/* Editar: te lleva al formulario de "Tu reseña" prellenado */}
                        <Button asChild variant="outline" size="sm">
                          <a href="#my-review-form">Editar</a>
                        </Button>

                        {/* Borrar tu reseña */}
                        <form action={deleteReviewAction.bind(null, id, key)}>
                          <Button type="submit" variant="destructive" size="sm">
                            Borrar
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Form SSR para crear/editar tu reseña */}
        {session?.user?.id ? (
          <div id="my-review-form" className="border rounded p-4 space-y-3">
            <h3 className="font-semibold">Tu reseña</h3>
            <form action={upsertReviewAction.bind(null, id)} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium">Puntaje (1-5)</label>
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  required
                  className="border rounded p-2 w-24"
                  defaultValue={myReview?.rating ?? ""}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Título (opcional)</label>
                <input
                  name="title"
                  className="border rounded p-2 w-full"
                  defaultValue={myReview?.title ?? ""}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Comentario (opcional)</label>
                <textarea
                  name="body"
                  className="border rounded p-2 w-full"
                  rows={4}
                  defaultValue={myReview?.body ?? ""}
                />
              </div>

              <Button type="submit">Guardar reseña</Button>
            </form>
          </div>
        ) : (
          <p className="text-sm">
            <Button asChild variant="link">
              <Link href={`/login?next=/book/${id}`}>Iniciá sesión</Link>
            </Button>{" "}
            para escribir una reseña.
          </p>
        )}
      </section>
    </section>
  );
}
