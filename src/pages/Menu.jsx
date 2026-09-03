import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MenuCard from '@/components/MenuCard';

const CATEGORIES = [
  'All',
  'Hot & Iced Coffee',
  'Wraps & Japanese Bao',
  'Speciality Burgers',
  'Fresh Dough Pizza',
  'Italian Pasta',
  'Desserts & Mocktails',
  'Texas Loaded Fries'
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    base44.entities.MenuItem.list()
      .then(setItems)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const catOk = active === 'All' || it.category === active;
      const qOk = !query || it.name.toLowerCase().includes(query.toLowerCase());
      return catOk && qOk;
    });
  }, [items, active, query]);

  return (
    <div className="pt-28 sm:pt-32">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">The Menu Magazine</p>
          <h1 className="font-display text-5xl sm:text-6xl text-primary">Our Menu</h1>
          <p className="mt-4 text-foreground/60 max-w-xl mx-auto">
            From Spanish lattes to Japanese bao and Texas loaded fries — a diverse, international table.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-full h-11 pl-11 pr-4 rounded-full border border-border bg-card text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0 lg:flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 h-10 px-4 rounded-full border text-[13px] transition-all ${
                  active === c
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-foreground/70 hover:border-primary/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-muted-foreground">Loading the menu…</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">No dishes match your search.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-16">
            {filtered.map((it) => (
              <MenuCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}