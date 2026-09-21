import React, { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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
              <div ref={menuRef} className="relative hidden md:block">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="User profile menu"
                  className="flex items-center gap-2 pl-1.5 pr-3 h-10 rounded-full border border-border/80 bg-background/80 hover:border-primary/50 hover:bg-card transition-all shadow-sm group"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 grid place-items-center text-xs font-semibold">
                      {user.name?.[0]?.toUpperCase() || 'G'}
                    </span>
                  )}
                  <span className="text-xs font-medium max-w-[100px] truncate text-foreground/90 group-hover:text-primary transition-colors">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                      menuOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl p-2 animate-fade-in z-50">
                    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border/60">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || 'User'}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-primary/15 text-primary grid place-items-center text-sm font-semibold">
                          {user.name?.[0]?.toUpperCase() || 'G'}
                        </span>
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/reservation"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-foreground/80 hover:text-primary hover:bg-muted/70 rounded-xl transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Reservations
                      </Link>
                      <Link
                        to="/menu"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-foreground/80 hover:text-primary hover:bg-muted/70 rounded-xl transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        Explore Menu
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-border/60">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.12em] text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log out
                      </button>
                    </div>
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
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-card/90 border border-border">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-primary/15 text-primary grid place-items-center text-sm font-semibold">
                        {user.name?.[0]?.toUpperCase() || 'G'}
                      </span>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border/60">
                    <Link
                      to="/reservation"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2 text-xs uppercase tracking-[0.12em] rounded-xl bg-muted/80 text-foreground/80 hover:text-primary transition-colors"
                    >
                      Reservations
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs uppercase tracking-[0.12em] rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 h-11 rounded-full border border-border text-sm uppercase tracking-[0.14em] text-foreground/80 hover:border-primary transition-colors"
                >
                  <User className="w-4 h-4" /> Login
                </Link>
              )}
              <Link
                to="/reservation"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-11 bg-primary text-primary-foreground text-sm uppercase tracking-[0.14em] rounded-full hover:bg-secondary transition-colors"
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