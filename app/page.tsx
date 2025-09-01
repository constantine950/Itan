"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";

type Event = {
  id: string;
  title: string;
  year: number;
  description: string;
  imageUrl?: string;
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      // Sort by year ascending
      setEvents(eventsData.sort((a, b) => a.year - b.year));
    };
    fetchEvents();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen py-16 px-6">
      <h1 className="text-center text-5xl font-extrabold text-emerald-700 mb-14">
        Ìtàn: Nigeria’s History
      </h1>

      <div className="relative max-w-4xl mx-auto">
        {/* Timeline vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-emerald-600"></div>

        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`mb-16 flex items-center w-full ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <Link
              href={`/event/${event.id}`}
              className="bg-white shadow-xl rounded-2xl p-6 w-[45%] relative hover:shadow-2xl hover:scale-105 transition-transform"
            >
              <span className="absolute top-6 -left-12 w-8 h-8 rounded-full bg-emerald-600 border-4 border-white"></span>
              <h2 className="text-emerald-700 text-xl font-bold">
                {event.year}
              </h2>
              <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
              <p className="mt-3 text-gray-600 line-clamp-3">
                {event.description}
              </p>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="mt-4 rounded-lg w-full object-cover max-h-48"
                />
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
