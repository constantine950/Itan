import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-4xl md:text-6xl font-bold">Ìtàn</h1>
      <p className="mt-4 text-lg text-gray-300">
        Discover Nigeria’s history through time.
      </p>
      <Link
        href="/timeline"
        className="mt-6 px-6 py-3 bg-emerald-500 rounded-xl font-medium hover:bg-emerald-600 transition"
      >
        Explore Timeline
      </Link>
    </section>
  );
}
