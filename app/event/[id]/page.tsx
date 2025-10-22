import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { EventPageProps } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        title: "Event Not Found — Ìtàn",
        description: "The requested event could not be found.",
      };
    }

    const event = docSnap.data() as {
      title?: string;
      description?: string;
      year?: number | string;
    };

    return {
      title: `${event.title} — Ìtàn`,
      description:
        event.description?.slice(0, 150) || "Historical event on Ìtàn",
    };
  } catch (error) {
    console.error("Failed to fetch event metadata:", error);

    return {
      title: "Error — Ìtàn",
      description: "There was an issue retrieving event data.",
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  // ✅ Fetch event document
  const { id } = await params;
  const eventRef = doc(db, "events", id);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
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

  const event = eventSnap.data() as {
    id: string;
    title: string;
    description: string;
    year: number;
    location?: string;
    image_url?: string;
    category_id?: number;
  };

  // ✅ Fetch category name based on numeric category_id
  let categoryName = "";
  if (event.category_id !== undefined && event.category_id !== null) {
    const q = query(
      collection(db, "categories"),
      where("id", "==", event.category_id) // numeric match
    );

    const categorySnapshot = await getDocs(q);
    if (!categorySnapshot.empty) {
      const categoryData = categorySnapshot.docs[0].data() as { name?: string };
      categoryName = categoryData.name || "";
    }
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
        {event.year} • {event.location} • {categoryName || "Unknown Category"}
      </p>

      {/* Description */}
      <p className="text-lg leading-relaxed text-gray-700 mb-10">
        {event.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${event.title} — via Ìtàn`
          )}&url=${encodeURIComponent(
            process.env.NEXT_PUBLIC_SITE_URL + "/event/" + id
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Share →
        </Link>

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
