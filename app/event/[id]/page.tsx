import { supabaseServer } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

// ✅ Metadata function (dynamic per event)
export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();

  const { data: event } = await supabase
    .from("events")
    .select("title, description, year")
    .eq("id", params.id)
    .single();

  if (!event) {
    return {
      title: "Event Not Found — Ìtàn",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${event.title} — Ìtàn`,
    description: event.description?.slice(0, 150) || "Historical event on Ìtàn",
  };
}

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = supabaseServer();

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      year,
      location,
      image_url,
      categories:categories(name)
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link
          href="/timeline"
          className="text-emerald-600 hover:underline mt-4 block"
        >
          ← Back to Timeline
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      {/* Event Image */}
      {event.image_url && (
        <div className="mb-6">
          <Image
            src={event.image_url}
            alt={event.title}
            width={800}
            height={400}
            className="rounded-xl object-cover w-full h-80"
          />
        </div>
      )}

      {/* Event Title & Info */}
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-500 mb-6">
        {event.year} • {event.location} • {event.categories?.[0]?.name}
      </p>

      {/* Description */}
      <p className="text-lg leading-relaxed text-gray-700 mb-10">
        {event.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {/* Share on Twitter */}
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${event.title} — via Ìtàn`
          )}&url=${encodeURIComponent(
            process.env.NEXT_PUBLIC_SITE_URL + "/event/" + event.id
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Share →
        </Link>

        {/* Back */}
        <Link
          href="/timeline"
          className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
        >
          ← Back to Timeline
        </Link>
      </div>
    </main>
  );
}
