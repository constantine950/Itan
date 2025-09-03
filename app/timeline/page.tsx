import { supabaseServer } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Timeline — Ìtàn",
  description: "Browse Nigeria’s history through an interactive timeline.",
};

export default async function TimelinePage() {
  const supabase = supabaseServer();

  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      year,
      description,
      image_url,
      categories:categories(name)
    `
    )
    .order("year", { ascending: true });

  if (error) {
    console.error("Failed to fetch events:", error.message);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Nigeria’s History Timeline
      </h1>

      {/* If no events */}
      {!events?.length ? (
        <p className="text-center text-gray-500">
          No events available yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-12">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row items-start gap-6 border-b pb-8"
            >
              {/* Event Image */}
              {event.image_url && (
                <div className="w-full md:w-1/3">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    width={400}
                    height={250}
                    className="rounded-xl object-cover w-full h-48 md:h-40"
                  />
                </div>
              )}

              {/* Event Content */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{event.title}</h2>
                <p className="text-gray-500 text-sm mb-2">
                  {event.year} • {event.categories?.[0]?.name}
                </p>
                <p className="text-gray-700 text-base mb-4 line-clamp-4">
                  {event.description}
                </p>

                <Link
                  href={`/event/${event.id}`}
                  className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
