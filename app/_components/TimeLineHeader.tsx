import Link from "next/link";

export default function TimeLineHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center md:text-left text-emerald-600">
        Nigeria’s Interactive Timeline
      </h1>

      <Link
        href="/"
        className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-medium"
      >
        ← Back Home
      </Link>
    </div>
  );
}
