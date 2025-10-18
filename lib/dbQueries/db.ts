import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Event } from "../types";

export async function getEvents() {
  let events: Event[] = [];

  try {
    const eventsQuery = query(
      collection(db, "events"),
      orderBy("id", "desc"),
      limit(3)
    );

    const snapshot = await getDocs(eventsQuery);
    events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title as string,
        year: data.year as number,
        description: data.description as string,
        image_url: data.image_url as string | undefined,
      };
    });

    return events;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch events:", error.message);
    } else {
      console.error("Unknown error fetching events");
    }
  }
}

export type Category = {
  id: string;
  name: string;
};

export type Eventt = {
  id: string;
  title: string;
  year: number;
  description: string;
  image_url?: string;
  category_id: string;
  categoryName?: string;
};

export async function fetchEvents(): Promise<Eventt[]> {
  try {
    // Fetch all categories
    const categorySnap = await getDocs(collection(db, "categories"));
    const categories: Record<string, string> = {};
    categorySnap.forEach((doc) => {
      const data = doc.data() as Category;
      categories[doc.id] = data.name;
    });

    // Fetch all events
    const eventsQuery = query(collection(db, "events"), orderBy("year", "asc"));
    const snapshot = await getDocs(eventsQuery);

    // Merge event data with category name
    const events: Eventt[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Eventt, "id">;
      return {
        id: doc.id,
        ...data,
        categoryName: categories[data.category_id] || "Unknown",
      };
    });

    return events;
  } catch (error) {
    console.error("Failed to fetch events:", (error as Error).message);
    return [];
  }
}
