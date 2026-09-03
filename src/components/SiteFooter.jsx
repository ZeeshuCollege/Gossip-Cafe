import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-3xl leading-none">Gossip</div>
            <p className="text-[11px] uppercase tracking-[0.25em] mt-2 text-primary-foreground/60">
              Café &amp; Restro
            </p>
            <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
              ssip, savor &amp; connect at your new favorite hangout spot in Mumbra.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mb-5">Visit</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground/50" />
                <span>Central Empire, MM Valley C1 Road, Opposite Central Heights, Mumbra, Thane, Maharashtra 400612</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground/50" />
                <a href="tel:+919920564615" className="hover:text-primary-foreground">+91 992-056-4615</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground/50" />
                <a href="mailto:gossipcafe2024@gmail.com" className="hover:text-primary-foreground">gossipcafe2024@gmail.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mb-5">Hours</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground/50" />
                <span>Mon – Fri<br />3:00 PM – 11:00 PM</span>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground/50" />
                <span>Sat – Sun<br />2:00 PM – 11:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50 mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/menu" className="hover:text-primary-foreground">Menu</Link></li>
              <li><Link to="/reservation" className="hover:text-primary-foreground">Reserve a Table</Link></li>
              <li><Link to="/policy" className="hover:text-primary-foreground">Policy &amp; Terms</Link></li>
              <li>
                <a href="https://instagram.com/gossip_cafeandrestro" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary-foreground">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} Gossip Café &amp; Restro. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-primary-foreground/50">
            <Link to="/policy" className="hover:text-primary-foreground">Privacy Policy</Link>
            <Link to="/policy" className="hover:text-primary-foreground">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}