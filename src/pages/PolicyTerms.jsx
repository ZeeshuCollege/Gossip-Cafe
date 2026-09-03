import React from 'react';

const sections = [
  {
    title: 'Reservation Policy',
    body: [
      '1.1 Tables are held for 15 minutes past the reserved time. Arrivals later than this window may be released to other guests.',
      '1.2 Cancellations are accepted free of charge up to 2 hours before the reserved time.',
      '1.3 No-shows: repeated no-shows may result in a temporary restriction on future reservations.',
      '1.4 Seating time: each reservation is held for a standard 90-minute seating window during peak hours. Extensions are subject to availability.',
      '1.5 Large parties (6 or more) may be asked to confirm via phone before the reservation is finalized.'
    ]
  },
  {
    title: 'Privacy Policy',
    body: [
      '2.1 We collect only the details you provide at reservation or sign-up — name, phone number, email, and any special-request notes.',
      '2.2 Your contact information is used solely to manage reservations, confirm bookings, and (with your consent) share relevant updates from Gossip Café & Restro.',
      '2.3 We do not sell or share your personal data with third parties for marketing purposes.',
      '2.4 You may request access to, correction of, or deletion of your stored details at any time by contacting us at gossipcafe2024@gmail.com.',
      '2.5 Payment details, where applicable, are processed by trusted third-party providers and are never stored on our own systems.'
    ]
  },
  {
    title: 'General Terms & Conditions',
    body: [
      '3.1 All menu items, prices, and availability are subject to change without prior notice.',
      '3.2 The management reserves the right to refuse service where necessary to maintain a safe and welcoming environment.',
      '3.3 Outside food and beverages are not permitted on the premises.',
      '3.4 By making a reservation you agree to abide by the seating policy and any reasonable directions of our staff.',
      '3.5 These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts at Thane, Maharashtra.'
    ]
  }
];

export default function PolicyTerms() {
  return (
    <div className="pt-28 sm:pt-32">
      <section className="mx-auto max-w-3xl px-5 sm:px-8 pb-16">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">The fine print</p>
          <h1 className="font-display text-5xl sm:text-6xl text-primary">Policy &amp; Terms</h1>
        </div>
        <div className="space-y-14">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-3xl text-primary mb-5 pb-3 border-b border-border">{s.title}</h2>
              <div className="space-y-4">
                {s.body.map((p, i) => (
                  <p key={i} className="text-foreground/75 leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-16 text-sm text-muted-foreground italic text-center">
          This content is standard boilerplate and can be edited by the owner at any time.
        </p>
      </section>
    </div>
  );
}