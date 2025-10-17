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
