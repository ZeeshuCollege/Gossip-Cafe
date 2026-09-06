import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Image } from '@/components/ui/image';

const hero = '/images/generated/cafe-hero.svg';
const ambience = '/images/generated/cafe-interior.svg';

const VIDS = 'https://media.base44.com/videos/public/6a99055dfce05e315129068b';
const categories = [
  { label: 'Hot & Cold Coffee', desc: 'Spanish lattes, cold brews & cappuccinos', video: `${VIDS}/4c82a3400_GSPV1.mp4` },
  { label: 'Bao & Burger', desc: 'Japanese bao, wraps & speciality burgers', video: `${VIDS}/202decf45_GSPV2.mp4` },
  { label: 'Pizza & Pasta', desc: 'Fresh dough pizza & Italian pasta', video: `${VIDS}/aa7f68bb2_GSPV3.mp4` },
  { label: 'Desserts & Mocktails', desc: 'Tiramisu, mousse, mojitos & shakes', video: `${VIDS}/89f073b15_GSPV4.mp4` }
];

const gallery = [
  '/images/generated/gallery-coffee.svg',
  '/images/generated/gallery-bao.svg',
  '/images/generated/gallery-pizza.svg',
  '/images/generated/gallery-dessert.svg',
  '/images/generated/gallery-night.svg',
  '/images/generated/gallery-table.svg'
];

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  return (
    <section className="relative min-h-[92vh] flex items-stretch">
      <div className="grid grid-cols-1 md:grid-cols-5 w-full">
        <div className="md:col-span-2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16 md:py-0 pt-28 md:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-6"
          >
            Mumbra · Thane
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-[44px] sm:text-6xl lg:text-7xl leading-[1.02] text-primary text-balance"
          >
            ssip, savor<br />&amp; connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-6 text-lg text-foreground/70 max-w-md leading-relaxed"
          >
            Your new favorite hangout spot — superior coffee, a diverse international menu, and a warm space built for community.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to="/reservation" className="inline-flex items-center gap-2 h-12 px-7 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] hover:bg-secondary transition-colors">
              Reserve a Table <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/menu" className="inline-flex items-center h-12 px-2 text-sm uppercase tracking-[0.14em] text-primary border-b border-primary/40 hover:border-primary">
              Explore the Menu
            </Link>
          </motion.div>
        </div>
        <div className="md:col-span-3 relative overflow-hidden min-h-[60vh] md:min-h-0">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
            <Image src={hero} alt="Spanish latte being poured" className="w-full h-full object-cover" fittingType="fill" focalPointY={0.4} />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 md:from-background/20 to-transparent" />
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden md:flex flex-col items-center gap-2">
        <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-10 bg-primary/40" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-5">About Gossip</p>
          <h2 className="font-display text-4xl sm:text-5xl text-primary leading-tight text-balance">
            A hub for coffee, cuisine &amp; community.
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            Gossip Café &amp; Restro is a gathering place for young people, families and business professionals alike — where superior coffee, a diverse international menu and genuine connection come together in the heart of Mumbra.
          </p>
          <Link to="/menu" className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-primary border-b border-primary/40 hover:border-primary pb-1">
            See what we serve <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden">
          <Image src={ambience} alt="Gossip Cafe interior" className="w-full h-full object-cover" fittingType="fill" />
        </motion.div>
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">From the kitchen</p>
          <h2 className="font-display text-4xl sm:text-5xl text-primary">Menu highlights</h2>
        </div>
        <Link to="/menu" className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-primary">
          Full menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}>
            <Link to="/menu" className="group block relative aspect-[3/4] rounded-2xl overflow-hidden">
              <video src={c.video} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl text-primary-foreground leading-tight">{c.label}</h3>
                <p className="mt-1 text-xs text-primary-foreground/70">{c.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">@gossip_cafeandrestro</p>
          <h2 className="font-display text-4xl sm:text-5xl text-primary">A taste of the everyday</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {gallery.map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="aspect-square rounded-xl overflow-hidden">
              <Image src={g} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" fittingType="fill" />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="https://instagram.com/gossip_cafeandrestro" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-primary border-b border-primary/40 hover:border-primary pb-1">
            Follow on Instagram <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        <div className="flex flex-col justify-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">Find us</p>
          <h2 className="font-display text-4xl sm:text-5xl text-primary mb-8">Visit Gossip</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 mt-1 text-secondary shrink-0" />
              <p className="text-foreground/80 leading-relaxed">Central Empire, MM Valley C1 Road, Opposite Central Heights, Mumbra, Thane, Maharashtra 400612</p>
            </div>
            <div className="flex gap-4">
              <Clock className="w-5 h-5 mt-1 text-secondary shrink-0" />
              <div className="text-foreground/80">
                <p>Mon – Fri · 3:00 PM – 11:00 PM</p>
                <p>Sat – Sun · 2:00 PM – 11:00 PM</p>
              </div>
            </div>
          </div>
          <Link to="/reservation" className="mt-9 inline-flex items-center gap-2 h-12 px-7 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] hover:bg-secondary transition-colors w-fit">
            Reserve a Table <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="rounded-3xl overflow-hidden min-h-[320px] border border-border">
          <iframe
            title="Gossip Cafe location"
            src="https://maps.google.com/maps?q=Central%20Empire%20MM%20Valley%20C1%20Road%20Mumbra%20Thane%20Maharashtra%20400612&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Featured />
      <Gallery />
      <Visit />
    </>
  );
}