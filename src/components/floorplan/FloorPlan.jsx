import React, { useState, useEffect } from 'react';

// Zone rectangles in a 1000x620 viewBox
const ZONES = [
  { id: 'window', label: 'Window Side', x: 40, y: 40, w: 640, h: 150 },
  { id: 'center', label: 'Open Hall', x: 200, y: 210, w: 480, h: 180 },
  { id: 'booth', label: 'Booths', x: 40, y: 210, w: 140, h: 360 },
  { id: 'bar', label: 'Bar & Counter', x: 200, y: 410, w: 480, h: 160 },
  { id: 'patio', label: 'Patio', x: 700, y: 210, w: 260, h: 360 }
];

function chairPositions(table) {
  const pts = [];
  const n = table.capacity;
  if (table.shape === 'circle' || table.shape === 'bar') {
    const r = (table.width || 80) / 2;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      pts.push({ x: table.x + Math.cos(a) * (r + 16), y: table.y + Math.sin(a) * (r + 16) });
    }
  } else if (table.shape === 'rect' || table.shape === 'booth') {
    const w = table.width || 120;
    const h = table.height || 70;
    const perTop = Math.max(1, Math.round(n / 2));
    for (let i = 0; i < perTop; i++) {
      pts.push({ x: table.x - w / 2 + (w / (perTop + 1)) * (i + 1), y: table.y - h / 2 - 14 });
    }
    for (let i = 0; i < n - perTop; i++) {
      pts.push({ x: table.x - w / 2 + (w / (n - perTop + 1)) * (i + 1), y: table.y + h / 2 + 14 });
    }
  }
  return pts;
}

function TableShape({ table, state, onSelect }) {
  const fill = state === 'booked' ? 'hsl(var(--muted))' : state === 'selected' ? 'hsl(var(--primary))' : 'hsl(var(--card))';
  const stroke = state === 'booked' ? 'hsl(var(--border))' : 'hsl(var(--primary))';
  const txt = state === 'selected' ? 'hsl(var(--primary-foreground))' : state === 'booked' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))';
  const chairs = chairPositions(table);
  const commonProps = {
    onClick: state === 'booked' ? undefined : onSelect,
    style: { cursor: state === 'booked' ? 'not-allowed' : 'pointer' }
  };

  return (
    <g {...commonProps}>
      {chairs.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={5} fill={state === 'booked' ? 'hsl(var(--border))' : 'hsl(var(--muted-foreground))'} opacity={0.5} />
      ))}
      {table.shape === 'circle' || table.shape === 'bar' ? (
        <circle cx={table.x} cy={table.y} r={(table.width || 80) / 2} fill={fill} stroke={stroke} strokeWidth={1.5} />
      ) : (
        <rect x={table.x - (table.width || 120) / 2} y={table.y - (table.height || 70) / 2} width={table.width || 120} height={table.height || 70} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
      )}
      <text x={table.x} y={table.y - 2} textAnchor="middle" fontSize={13} fontFamily="var(--font-body)" fontWeight={500} fill={txt}>
        {table.name}
      </text>
      <text x={table.x} y={table.y + 14} textAnchor="middle" fontSize={10} fontFamily="var(--font-body)" fill={txt} opacity={0.7}>
        {table.capacity} seats
      </text>
    </g>
  );
}

export default function FloorPlan({ tables, bookedIds = [], selectedId, onSelect }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isMobile) {
    const grouped = ZONES.map((z) => ({ ...z, tables: tables.filter((t) => t.zone === z.id) })).filter((z) => z.tables.length);
    return (
      <div className="space-y-6">
        {grouped.map((z) => (
          <div key={z.id}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{z.label}</p>
            <div className="grid grid-cols-2 gap-3">
              {z.tables.map((t) => {
                const booked = bookedIds.includes(t.id);
                const selected = selectedId === t.id;
                return (
                  <button
                    key={t.id}
                    disabled={booked}
                    onClick={() => onSelect(t)}
                    className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all min-h-[72px] ${
                      booked
                        ? 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                        : selected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-card border-border text-primary hover:border-primary/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs opacity-70">{t.capacity} seats</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto no-scrollbar">
      <svg viewBox="0 0 1000 620" className="w-full min-w-[640px] h-auto" style={{ maxHeight: '70vh' }}>
        {ZONES.map((z) => (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={16} fill="hsl(var(--muted))" opacity={0.4} stroke="hsl(var(--border))" strokeDasharray="3 5" strokeWidth={1} />
            <text x={z.x + 12} y={z.y + 22} fontSize={11} fontFamily="var(--font-body)" letterSpacing={2} fill="hsl(var(--muted-foreground))" opacity={0.8}>
              {z.label.toUpperCase()}
            </text>
          </g>
        ))}
        {tables.map((t) => {
          const state = bookedIds.includes(t.id) ? 'booked' : selectedId === t.id ? 'selected' : 'available';
          return <TableShape key={t.id} table={t} state={state} onSelect={() => onSelect(t)} />;
        })}
      </svg>
    </div>
  );
}