"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const GENDERS = ["MEN", "WOMEN", "UNISEX"];
const SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Alphabetical", value: "alphabetical" },
];

export function ShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <aside className="flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-3 text-gold">Sort By</p>
        <select
          className="glass-light w-full rounded-md px-3 py-2 text-sm"
          value={params.get("sort") ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="eyebrow mb-3 text-gold">Gender</p>
        <div className="flex flex-col gap-2 text-sm">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={params.get("gender") === g}
                onChange={() => setParam("gender", g)}
              />
              {g.charAt(0) + g.slice(1).toLowerCase()}
            </label>
          ))}
          <button className="mt-1 text-left text-xs text-noir/50 dark:text-cream/50" onClick={() => setParam("gender", null)}>
            Clear
          </button>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3 text-gold">Season</p>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <button
              key={s}
              onClick={() => setParam("season", params.get("season") === s ? null : s)}
              className={`rounded-full border px-3 py-1 text-xs ${
                params.get("season") === s ? "border-gold bg-gold text-noir" : "border-noir/20 dark:border-cream/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3 text-gold">Price</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="glass-light w-full rounded-md px-3 py-2 text-sm"
            defaultValue={params.get("minPrice") ?? ""}
            onBlur={(e) => setParam("minPrice", e.target.value || null)}
          />
          <input
            type="number"
            placeholder="Max"
            className="glass-light w-full rounded-md px-3 py-2 text-sm"
            defaultValue={params.get("maxPrice") ?? ""}
            onBlur={(e) => setParam("maxPrice", e.target.value || null)}
          />
        </div>
      </div>
    </aside>
  );
}
