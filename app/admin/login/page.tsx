import { supabaseServer } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const supabase = supabaseServer();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin");
  }

  return (
    <main className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form action={handleLogin} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
