"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

type Event = {
  id: number;
  title: string;
  year: number;
  description: string;
  image_url?: string;
  category_id?: number;
};

const categories: Record<number, string> = {
  1: "Pre-colonial",
  2: "Colonial Era",
  3: "Independence & First Republic",
  4: "Military Rule",
  5: "Democracy",
};

export default function TimelineClient({ events }: { events: Event[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<number | "all">("all");

  // ✅ Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || event.category_id === category;

    return matchesSearch && matchesCategory;
  });

  // ✅ Group by category
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const cat = event.category_id || 0;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <h1 className="text-4xl font-bold text-center md:text-left">
            Nigeria’s Interactive Timeline
          </h1>

          {/* Back Home button */}
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back Home
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All Categories</option>
            {Object.entries(categories).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 border-l-2 border-emerald-500" />

          {Object.entries(groupedEvents).map(([catId, catEvents]) => (
            <div key={catId} className="mb-16">
              {/* Era divider */}
              <h2 className="text-2xl font-bold text-center mb-8 text-emerald-700">
                {categories[Number(catId)]}
              </h2>

              <ul className="space-y-12">
                {catEvents.map((event, index) => (
                  <motion.li
                    key={event.id}
                    className={`relative flex items-start gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {/* Dot marker */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full -translate-x-1/2 mt-2" />

                    {/* Card */}
                    <motion.div
                      className="bg-white shadow rounded-2xl p-6 w-full md:w-5/12"
                      initial={{ scale: 0.95 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {event.image_url && (
                        <div className="relative w-full h-40 mb-4">
                          <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-emerald-600">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-3">
                        {event.description}
                      </p>
                      <Link
                        href={`/event/${event.id}`}
                        className="mt-4 inline-block text-emerald-600 font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
