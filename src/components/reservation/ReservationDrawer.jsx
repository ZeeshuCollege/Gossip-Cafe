import React, { useState, useEffect } from 'react';
import { X, Check, Users, Calendar, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DatePicker from './DatePicker';
import TimeSlots from './TimeSlots';
import { useMockAuth } from '@/lib/mockAuth';

export default function ReservationDrawer({ table, reservations = [], onClose, onConfirmed }) {
  const { user } = useMockAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [party, setParty] = useState(Math.min(2, table?.capacity || 2));
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.user_metadata?.name || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.user_metadata?.phone || user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    setDate(''); setTime(''); setDone(null); setParty(Math.min(2, table?.capacity || 2));
  }, [table?.id]);

  if (!table) return null;

  const reservationsForTable = reservations.filter(
    (reservation) => reservation.table_id === table.id && reservation.status !== 'cancelled'
  );
  const isBookedOnDate = Boolean(
    date && time && reservationsForTable.some(
      (reservation) => reservation.date === date && reservation.time === time
    )
  );

  const submit = async () => {
    if (!date || !time || !form.name || !form.phone || isBookedOnDate) return;
    setSubmitting(true);
    try {
      const rec = await base44.entities.Reservation.create({
        table_id: table.id,
        table_name: table.name,
        date,
        time,
        party_size: party,
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
        status: 'confirmed'
      });
      setDone(rec);
      onConfirmed?.(rec);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const prettyDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';
  const prettyTime = time
    ? new Date('1970-01-01T' + time + ':00').toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-background z-50 shadow-2xl flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Table {table.name}</p>
            <h3 className="font-display text-2xl text-primary">{done ? 'Reservation Confirmed' : 'Reserve this table'}</h3>
          </div>
          <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          {done ? (
            <div className="space-y-6 pt-4">
              <div className="grid place-items-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground grid place-items-center">
                  <Check className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <Row label="Table" value={done.table_name} />
                <Row label="Date" value={prettyDate} />
                <Row label="Time" value={prettyTime} />
                <Row label="Party size" value={`${done.party_size} guests`} />
                <Row label="Name" value={done.name} />
                <Row label="Phone" value={done.phone} />
                {done.email && <Row label="Email" value={done.email} />}
                {done.notes && <Row label="Notes" value={done.notes} />}
              </div>
              <button onClick={onClose} className="w-full h-12 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em]">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" /> Seats {table.capacity} · {table.zone} zone
              </div>

              {isBookedOnDate && date && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-xl">
                  This table is already booked at {prettyTime} on {prettyDate}. Pick another time.
                </p>
              )}

              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" /> Choose a date
                </label>
                <DatePicker value={date} onChange={(d) => { setDate(d); setTime(''); }} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  <Clock className="w-3.5 h-3.5" /> Choose a time
                </label>
                <TimeSlots date={date} value={time} onChange={setTime} />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Party size</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: table.capacity }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setParty(n)}
                      className={`w-11 h-11 rounded-full border text-sm transition-all ${
                        party === n ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 ..." />
                <Field label="Email (optional)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" />
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Special requests</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="Birthday, window seat, etc."
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {!done && (
          <div className="px-6 py-4 border-t border-border">
            <button
              onClick={submit}
              disabled={!date || !time || !form.name || !form.phone || submitting}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
            >
              {submitting ? 'Confirming…' : 'Confirm Reservation'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-border bg-card px-4 text-sm focus:outline-none focus:border-primary/50"
      />
    </div>
  );
}