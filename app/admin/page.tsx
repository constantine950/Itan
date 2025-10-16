import { supabaseServer } from "@/lib/supabase";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import EventForm from "../_components/EventForm";

export default async function AdminPage() {
  const supabase = supabaseServer();

  // ✅ Fetch events
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, year")
    .order("year", { ascending: true });

  if (error) {
    console.error("Failed to fetch events:", error.message);
  }

  // ✅ Delete action
  async function handleDelete(formData: FormData) {
    "use server";

    const supabase = supabaseServer();
    const id = formData.get("id") as string;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* ✅ Logout via server action */}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Add Event Form */}
      <EventForm />

      {/* Event List */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Existing Events</h2>
        {events?.length ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {event.year} — {event.title}
                </span>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/edit/${event.id}`}
                    className="text-emerald-600 hover:underline"
                  >
                    Edit
                  </Link>

                  {/* Inline Delete Button */}
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={event.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No events yet.</p>
        )}
      </section>
    </main>
  );
}
