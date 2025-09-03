import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";

export default async function HomePage() {
  const supabase = supabaseServer();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, year, description, image_url")
    .order("id", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to fetch events:", error.message);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <h1 className="text-4xl md:text-6xl font-bold">Ìtàn</h1>
        <p className="mt-4 text-lg text-gray-300">
          Discover Nigeria’s history through time.
        </p>
        <Link
          href="/timeline"
          className="mt-6 px-6 py-3 bg-emerald-500 rounded-xl font-medium hover:bg-emerald-600 transition"
        >
          Explore Timeline
        </Link>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Ìtàn?</h2>
        <p className="text-gray-600">
          Ìtàn makes Nigerian history interactive and accessible. Browse key
          events, explore timelines, and share stories that shaped our nation.
        </p>
      </section>

      {/* Event Preview Section */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Featured Events
        </h2>

        {events?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow p-4 flex flex-col"
              >
                {event.image_url && (
                  <div className="relative h-40 w-full mb-4">
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.year}</p>
                <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                  {event.description}
                </p>
                <Link
                  href={`/event/${event.id}`}
                  className="mt-auto text-emerald-600 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No events available yet. Check back soon!
          </p>
        )}
      </section>
    </main>
  );
}
