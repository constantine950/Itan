"use client";

import { useState } from "react";
import TimeLineHeader from "../_components/TimeLineHeader";
import Filters from "../_components/Filters";
import Event from "../_components/Event";
import { Eventt } from "@/lib/types";

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
        <TimeLineHeader />

        {/* Filters */}
        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categoryList={categoryList}
        />

        {/* Timeline */}
        <div className="max-w-6xl mx-auto mt-10">
          {Object.entries(groupedEvents).map(([catName, catEvents]) => (
            <section key={catName} className="mb-16">
              {/* Era Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-8 text-center">
                {catName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {catEvents.map((event) => (
                  <Event
                    key={event.id}
                    id={event.id}
                    year={event.year}
                    description={event.description}
                    title={event.title}
                    image_url={event.image_url!}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
