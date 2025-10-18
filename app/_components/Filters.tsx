import { FilterProps } from "@/lib/types";

export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  categoryList,
}: FilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-14">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value === "all" ? "all" : e.target.value)
        }
        className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-400"
      >
        <option value="all">All Eras</option>
        {categoryList.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
