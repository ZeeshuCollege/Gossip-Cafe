import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DatePicker({ value, onChange, days = 14 }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const scroller = useRef(null);

  const scrollBy = (dir) => {
    if (scroller.current) scroller.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative">
      <button onClick={() => scrollBy(-1)} className="hidden sm:grid place-items-center absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border border-border hover:border-primary/40">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div ref={scroller} className="flex gap-2 overflow-x-auto no-scrollbar py-1 sm:px-6">
        {dates.map((d) => {
          const key = fmt(d);
          const active = value === key;
          const isToday = d.toDateString() === today.toDateString();
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`shrink-0 w-16 sm:w-[68px] py-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1 ${
                active
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card border-border text-foreground hover:border-primary/40'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-[0.14em] ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {DAY_LABEL[d.getDay()]}
              </span>
              <span className="font-display text-xl leading-none">{d.getDate()}</span>
              <span className={`text-[10px] uppercase tracking-[0.14em] ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {MONTH_LABEL[d.getMonth()]}
              </span>
              {isToday && (
                <span className={`w-1 h-1 rounded-full ${active ? 'bg-primary-foreground/70' : 'bg-primary'}`} />
              )}
            </button>
          );
        })}
      </div>
      <button onClick={() => scrollBy(1)} className="hidden sm:grid place-items-center absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border border-border hover:border-primary/40">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}