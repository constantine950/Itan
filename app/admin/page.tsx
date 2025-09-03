import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import EventForm from "../_components/EventForm";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = supabaseServer();

  // ✅ Fetch events server-side
  const { data: events } = await supabase
    .from("events")
    .select("id, title, year")
    .order("year", { ascending: true });

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Server Action Form */}
      <EventForm />

      {/* Event List */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Existing Events</h2>
        <ul className="space-y-2">
          {events?.map((event) => (
            <li key={event.id} className="flex justify-between items-center">
              <span>
                {event.year} — {event.title}
              </span>
              <Link
                href={`/admin/edit/${event.id}`}
                className="text-emerald-600 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
