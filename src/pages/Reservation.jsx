import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import FloorPlan from '@/components/floorplan/FloorPlan';
import ReservationDrawer from '@/components/reservation/ReservationDrawer';

const DEFAULT_TABLES = [
  { id: 'table-window-1', name: 'W1', capacity: 2, shape: 'circle', x: 125, y: 105, width: 64, height: 64, zone: 'window', status: 'available' },
  { id: 'table-window-2', name: 'W2', capacity: 2, shape: 'circle', x: 265, y: 105, width: 64, height: 64, zone: 'window', status: 'available' },
  { id: 'table-window-3', name: 'W3', capacity: 4, shape: 'rect', x: 430, y: 105, width: 110, height: 64, zone: 'window', status: 'available' },
  { id: 'table-center-1', name: 'C1', capacity: 4, shape: 'circle', x: 275, y: 275, width: 82, height: 82, zone: 'center', status: 'available' },
  { id: 'table-center-2', name: 'C2', capacity: 4, shape: 'circle', x: 475, y: 275, width: 82, height: 82, zone: 'center', status: 'available' },
  { id: 'table-booth-1', name: 'B1', capacity: 4, shape: 'booth', x: 110, y: 280, width: 110, height: 70, zone: 'booth', status: 'available' },
  { id: 'table-booth-2', name: 'B2', capacity: 4, shape: 'booth', x: 110, y: 445, width: 110, height: 70, zone: 'booth', status: 'available' },
  { id: 'table-bar-1', name: 'Bar 1', capacity: 2, shape: 'bar', x: 285, y: 490, width: 68, height: 68, zone: 'bar', status: 'available' },
  { id: 'table-bar-2', name: 'Bar 2', capacity: 2, shape: 'bar', x: 420, y: 490, width: 68, height: 68, zone: 'bar', status: 'available' },
  { id: 'table-patio-1', name: 'P1', capacity: 4, shape: 'rect', x: 825, y: 300, width: 110, height: 64, zone: 'patio', status: 'available' },
  { id: 'table-patio-2', name: 'P2', capacity: 4, shape: 'rect', x: 825, y: 470, width: 110, height: 64, zone: 'patio', status: 'available' }
];

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
      setTables(Array.isArray(t) && t.length ? t : DEFAULT_TABLES);
      setReservations(Array.isArray(r) ? r : []);
    } catch (e) {
      console.error(e);
      setTables(DEFAULT_TABLES);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const bookedIds = tables.filter((table) => table.status === 'booked').map((table) => table.id);

  return (
    <div className="pt-28 sm:pt-32">
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-16">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">Choose your space</p>
          <h1 className="font-display text-5xl sm:text-6xl text-primary">Reserve a Table</h1>
          <p className="mt-4 text-foreground/60 max-w-xl mx-auto">
            Choose a table on our cafe floor plan, then select your date, time, and party size.
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
          Tap a table to begin. Greyed tables are unavailable for walk-in seating.
        </p>
      </section>

      {selected && (
        <ReservationDrawer
          table={selected}
          reservations={reservations}
          onClose={() => setSelected(null)}
          onConfirmed={() => load()}
        />
      )}
    </div>
  );
}