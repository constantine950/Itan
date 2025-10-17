import Image from "next/image";
import Link from "next/link";
import { getEvents } from "@/lib/dbQueries/db";
import HeroSection from "./_components/HeroSection";
import AboutSection from "./_components/AboutSection";

export default async function HomePage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

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
