import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import FloorPlan from '@/components/floorplan/FloorPlan';
import ReservationDrawer from '@/components/reservation/ReservationDrawer';

function Legend() {
  const items = [
    { label: 'Available', cls: 'bg-card border-primary' },
    { label: 'Selected', cls: 'bg-primary border-primary' },
    { label: 'Booked', cls: 'bg-muted border-border' }
  ];
  return (
    <div className="flex flex-wrap items-center gap-6 mt-6">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-md border ${i.cls}`} />
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{i.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reservation() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const [t, r] = await Promise.all([
        base44.entities.Table.list(),
        base44.entities.Reservation.list()
      ]);
      setTables(t);
      setReservations(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const bookedIds = reservations.map((r) => r.table_id);

  return (
    <div className="pt-28 sm:pt-32">
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-16">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">Claim your space</p>
          <h1 className="font-display text-5xl sm:text-6xl text-primary">Reserve a Table</h1>
          <p className="mt-4 text-foreground/60 max-w-xl mx-auto">
            Pick your spot on the floor plan, choose a date and time, and we'll hold your table.
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center text-muted-foreground">Preparing the floor plan…</div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-8">
            <FloorPlan
              tables={tables}
              bookedIds={bookedIds}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
            <Legend />
          </div>
        )}

        <p className="mt-6 text-sm text-muted-foreground text-center">
          Tap a table to begin. Greyed tables are already reserved.
        </p>
      </section>

      {selected && (
        <ReservationDrawer
          table={selected}
          bookedIds={bookedIds}
          onClose={() => setSelected(null)}
          onConfirmed={() => load()}
        />
      )}
    </div>
  );
}