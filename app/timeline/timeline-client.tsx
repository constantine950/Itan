"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eventt } from "@/lib/dbQueries/db";

export default function TimelineClient({ events }: { events: Eventt[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | "all">("all");

  // ✅ Dynamic category list
  const categoryList = Array.from(
    new Set(events.map((e) => e.categoryName))
  ).filter(Boolean);

  // ✅ Filter logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || event.categoryName === category;

    return matchesSearch && matchesCategory;
  });

  // ✅ Group by category
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const cat = event.categoryName || "Unknown";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(event);
    return acc;
  }, {} as Record<string, Eventt[]>);

  return (
    <main className="min-h-screen py-20 bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center md:text-left text-emerald-600">
            Nigeria’s Interactive Timeline
          </h1>

          <Link
            href="/"
            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-medium"
          >
            ← Back Home
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-14">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value === "all" ? "all" : e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">All Eras</option>
            {categoryList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div className="max-w-6xl mx-auto mt-10">
          {Object.entries(groupedEvents).map(([catName, catEvents]) => (
            <section key={catName} className="mb-16">
              {/* Era Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-8 text-center">
                {catName}
              </h2>

              {/* Events in Grid (No Zigzag) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {catEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-6"
                  >
                    {event.image_url && (
                      <div className="relative w-full h-44 mb-4 rounded-xl overflow-hidden">
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <span className="text-sm font-semibold text-emerald-600">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-bold mt-1 text-gray-900">
                      {event.title}
                    </h3>
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
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
