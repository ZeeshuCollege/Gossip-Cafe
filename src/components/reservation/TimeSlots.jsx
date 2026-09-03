import React from 'react';

// Cafe hours: Mon–Fri 3pm–11pm, Sat–Sun 2pm–11pm
function slotsFor(dateStr) {
  if (!dateStr) return [];
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const weekend = day === 0 || day === 6;
  const startHour = weekend ? 14 : 15;
  const endHour = 23;
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const dt = new Date(d);
      dt.setHours(h, m, 0, 0);
      const label = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      slots.push({ value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, label });
    }
  }
  return slots;
}

export default function TimeSlots({ date, value, onChange }) {
  const slots = slotsFor(date);
  if (!date) {
    return <p className="text-sm text-muted-foreground">Select a date to view available times.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((s) => {
        const active = value === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={`px-4 h-10 rounded-full border text-sm transition-all duration-300 ${
              active
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-border text-foreground/80 hover:border-primary/50'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}