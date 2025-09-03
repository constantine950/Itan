import { supabaseServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export default function EventForm() {
  async function handleSubmit(formData: FormData) {
    "use server";

    const supabase = supabaseServer();

    const title = formData.get("title") as string;
    const year = parseInt(formData.get("year") as string);
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const image_url = formData.get("image_url") as string;
    const category_id = parseInt(formData.get("category_id") as string);

    const { error } = await supabase
      .from("events")
      .insert([{ title, year, description, location, image_url, category_id }]);

    if (error) {
      throw new Error(error.message);
    }

    // ✅ refresh admin page after insert
    revalidatePath("/admin");
  }

  return (
    <form
      action={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold">Add New Event</h2>

      <input
        name="title"
        placeholder="Event Title"
        className="w-full border rounded-lg px-3 py-2"
        required
      />
      <input
        name="year"
        type="number"
        placeholder="Year"
        className="w-full border rounded-lg px-3 py-2"
        required
      />
      <input
        name="location"
        placeholder="Location"
        className="w-full border rounded-lg px-3 py-2"
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full border rounded-lg px-3 py-2"
        rows={4}
        required
      />
      <input
        name="image_url"
        placeholder="Image URL"
        className="w-full border rounded-lg px-3 py-2"
      />
      <input
        name="category_id"
        type="number"
        placeholder="Category ID"
        defaultValue={1}
        className="w-full border rounded-lg px-3 py-2"
        required
      />

      <button
        type="submit"
        className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
      >
        Save Event
      </button>
    </form>
  );
}
