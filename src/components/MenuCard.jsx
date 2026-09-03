import React from 'react';
import { Image } from '@/components/ui/image';
import { Leaf, Flame, Drumstick } from 'lucide-react';

function DietaryTag({ type }) {
  if (type === 'veg') return <Leaf className="w-3.5 h-3.5 text-secondary" />;
  if (type === 'spicy') return <Flame className="w-3.5 h-3.5 text-destructive" />;
  return <Drumstick className="w-3.5 h-3.5 text-muted-foreground" />;
}

export default function MenuCard({ item }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/30">
      {item.image_url && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
          <Image src={item.image_url} alt="" className="w-full h-full object-cover" fittingType="fill" />
        </div>
      )}
      <div className="relative flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl text-primary leading-tight">{item.name}</h3>
          <DietaryTag type={item.dietary} />
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">{item.category}</span>
          <span className="font-display text-xl text-primary">
            {item.price ? `₹${item.price}` : <span className="text-sm text-muted-foreground italic">TBD</span>}
          </span>
        </div>
      </div>
    </div>
  );
}