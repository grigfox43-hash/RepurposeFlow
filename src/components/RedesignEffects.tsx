'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function RedesignEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Lenis Smooth Scroll
    let lenis: Lenis | null = null;
    let tickerCb: ((time: number) => void) | null = null;

    if (!prefersReducedMotion) {
      try {
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        tickerCb = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(tickerCb);
        gsap.ticker.lagSmoothing(0);
      } catch (err) {
        console.warn('Lenis init:', err);
      }
    }

    // 2. Scroll Progress Bar
    const handleScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const progressEl = document.querySelector('.scroll-progress') as HTMLElement | null;
      if (progressEl) {
        const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
        progressEl.style.width = `${pct}%`;
      }

      // 3. Header Scrolled class
      const headerEl = document.querySelector('header');
      if (headerEl) {
        if (window.scrollY > 50) {
          headerEl.classList.add('nav--scrolled');
        } else {
          headerEl.classList.remove('nav--scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 4. Hero Title Split-Text Animation
    const heroTitleEl = document.querySelector('.hero-title') as HTMLElement | null;
    if (heroTitleEl && !heroTitleEl.dataset.splitReady && !prefersReducedMotion) {
      heroTitleEl.dataset.splitReady = 'true';
      const words = heroTitleEl.querySelectorAll('.word');
      if (words.length > 0) {
        gsap.from(words, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.1
        });
      }
    }

    // 5. Hero Blob Mouse Parallax (desktop only)
    const isDesktop = window.innerWidth > 768;
    const heroSection = document.querySelector('.hero-section') as HTMLElement | null;
    const heroBlob = document.querySelector('.hero-blob') as HTMLElement | null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroBlob || prefersReducedMotion) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      gsap.to(heroBlob, { x, y, duration: 0.6, ease: 'power2.out' });
    };

    if (isDesktop && heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove);
    }

    // 6. Step Cards Scroll Trigger Animation
    const stepCards = gsap.utils.toArray('.step-card') as HTMLElement[];
    if (stepCards.length > 0 && !prefersReducedMotion) {
      stepCards.forEach((card) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });
    }

    // 7. Feature Cards 3D Tilt (desktop only)
    const featureCards = document.querySelectorAll('.feature-card') as NodeListOf<HTMLElement>;
    const cleanups: Array<() => void> = [];

    if (isDesktop && !prefersReducedMotion) {
      featureCards.forEach((card) => {
        const onCardMouseMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateY: px * 10,
            rotateX: -py * 10,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 600
          });
        };

        const onCardMouseLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.4, ease: 'power2.out' });
        };

        card.addEventListener('mousemove', onCardMouseMove);
        card.addEventListener('mouseleave', onCardMouseLeave);

        cleanups.push(() => {
          card.removeEventListener('mousemove', onCardMouseMove);
          card.removeEventListener('mouseleave', onCardMouseLeave);
        });
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isDesktop && heroSection) {
        heroSection.removeEventListener('mousemove', handleMouseMove);
      }
      cleanups.forEach((fn) => fn());
      if (tickerCb) {
        gsap.ticker.remove(tickerCb);
      }
      if (lenis) {
        lenis.destroy();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
