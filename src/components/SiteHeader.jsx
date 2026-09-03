import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useMockAuth } from '@/lib/mockAuth';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Reservation', to: '/reservation' },
  { label: 'Policy & Terms', to: '/policy' }
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useMockAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/85 backdrop-blur-md border-b border-border/60' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl sm:text-[28px] leading-none tracking-tight text-primary">
              Gossip
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Café &amp; Restro
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[13px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  isActive(l.to) ? 'text-primary' : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 h-10 rounded-full border border-border hover:border-primary/40 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-medium">
                    {(user.user_metadata?.name || user.name || user.email || 'G')[0].toUpperCase()}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl p-2 animate-fade-in">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground truncate">{user.user_metadata?.name || user.name || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-muted rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 text-[13px] uppercase tracking-[0.14em] text-foreground/70 hover:text-primary transition-colors"
              >
                <User className="w-4 h-4" /> Login
              </Link>
            )}

            <Link
              to="/reservation"
              className="hidden sm:inline-flex items-center h-10 px-5 bg-primary text-primary-foreground text-[13px] uppercase tracking-[0.14em] rounded-full hover:bg-secondary transition-colors duration-300"
            >
              Reserve a Table
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden grid place-items-center w-10 h-10 text-primary"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/60 animate-fade-in">
          <nav className="px-5 py-5 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`py-3 text-sm uppercase tracking-[0.14em] border-b border-border/40 ${
                  isActive(l.to) ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center justify-center gap-2 h-11 rounded-full border border-border text-sm uppercase tracking-[0.14em] text-foreground/80"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 h-11 rounded-full border border-border text-sm uppercase tracking-[0.14em] text-foreground/80"
                >
                  <User className="w-4 h-4" /> Login
                </Link>
              )}
              <Link
                to="/reservation"
                className="flex items-center justify-center h-11 bg-primary text-primary-foreground text-sm uppercase tracking-[0.14em] rounded-full"
              >
                Reserve a Table
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}