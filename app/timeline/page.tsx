import { supabaseServer } from "@/lib/supabase";
import TimelineClient from "./timeline-client";

export default async function TimelinePage() {
  const supabase = supabaseServer();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, year, description, image_url")
    .order("year", { ascending: true });

  if (error) {
    console.error("Failed to fetch events:", error.message);
  }

  return <TimelineClient events={events || []} />;
}
