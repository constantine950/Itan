import { notFound, redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseServer();

  // ✅ Fetch event
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!event) {
    notFound();
  }

  // ✅ Update action
  async function handleUpdate(formData: FormData) {
    "use server";

    const supabase = supabaseServer();

    const title = formData.get("title") as string;
    const year = parseInt(formData.get("year") as string);
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;
    const category_id = parseInt(formData.get("category_id") as string);

    const { error } = await supabase
      .from("events")
      .update({
        title,
        year,
        location,
        description,
        image_url,
        category_id,
      })
      .eq("id", params.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");
    redirect("/admin");
  }

  // ✅ Delete action
  async function handleDelete() {
    "use server";

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", params.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

      {/* Update Form */}
      <form
        action={handleUpdate}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        <input
          name="title"
          defaultValue={event.title}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          name="year"
          type="number"
          defaultValue={event.year}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          name="location"
          defaultValue={event.location || ""}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          name="description"
          defaultValue={event.description}
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
          required
        />

        <input
          name="image_url"
          defaultValue={event.image_url || ""}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          name="category_id"
          type="number"
          defaultValue={event.category_id}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Save Changes
          </button>

          <a
            href="/admin"
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </a>
        </div>
      </form>

      {/* Delete Form (separate, no nesting) */}
      <form action={handleDelete} className="mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Event
        </button>
      </form>
    </main>
  );
}
