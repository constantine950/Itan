import TimelineClient from "./timeline-client";
import { fetchEvents } from "@/lib/dbQueries/db";

export default async function TimelinePage() {
  const events = await fetchEvents();

  return <TimelineClient events={events || []} />;
}
