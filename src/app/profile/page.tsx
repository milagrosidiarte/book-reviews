import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Favorite from "@/models/Favorite";
import type { IReview } from "@/models/Review";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

// ---- Server actions ----
async function deleteReviewFromProfile(reviewId: string) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/profile");

  await connectDB();
  await Review.findOneAndDelete({ _id: reviewId, userId: session.user.id });
  revalidatePath("/profile");
}

async function removeFavorite(volumeId: string) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/profile");

  await connectDB();
  await Favorite.findOneAndDelete({ userId: session.user.id, volumeId });
  revalidatePath("/profile");
}

// ---- Page ----
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/profile");

  await connectDB();

  const myReviews = await Review.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean<IReview[]>();

  type FavDoc = { _id: any; volumeId: string };
  const myFavorites = await Favorite.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean<FavDoc[]>();

  return (
    <section className="max-w-3xl mx-auto py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-sm text-muted-foreground">
          {session.user.name || session.user.email}
        </p>
      </header>

      {/* Reseñas */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Tus reseñas</h2>
        {myReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no escribiste reseñas.</p>
        ) : (
          <ul className="space-y-3">
            {myReviews.map((r) => (
              <li key={String(r._id)} className="border rounded p-3">
                <div className="font-medium">
                  {r.title || "(sin título)"} — {r.rating}/5
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Libro:{" "}
                  <Link className="underline" href={`/book/${r.volumeId}`}>
                    {r.volumeId}
                  </Link>
                </div>
                {r.body && <p className="text-sm mb-2">{r.body}</p>}

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/book/${r.volumeId}#my-review-form`}>Editar</Link>
                  </Button>
                  <form action={deleteReviewFromProfile.bind(null, String(r._id))}>
                    <Button type="submit" variant="destructive" size="sm">
                      Borrar
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Favoritos */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Tus favoritos</h2>
        {myFavorites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tenés libros en favoritos.</p>
        ) : (
          <ul className="space-y-2">
            {myFavorites.map((f) => (
              <li key={String(f._id)} className="flex items-center justify-between border rounded p-2">
                <Link className="underline" href={`/book/${f.volumeId}`}>
                  {f.volumeId}
                </Link>
                <form action={removeFavorite.bind(null, f.volumeId)}>
                  <Button type="submit" size="sm" variant="outline">
                    Quitar
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
