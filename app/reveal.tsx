"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function RevealMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ autoRaf: false, duration: 1.05, smoothWheel: true });
    const updateScroll = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    const handleAnchorNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search || !destination.hash) return;

      const section = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (!section) return;

      event.preventDefault();
      if (window.location.hash !== destination.hash) {
        window.history.pushState(null, "", destination.hash);
      }
      const headerHeight = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().height ?? 0;
      lenis.scrollTo(section, { offset: -(headerHeight + 12), duration: 1.15 });
    };

    lenis.on("scroll", updateScroll);
    document.addEventListener("click", handleAnchorNavigation);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy .reveal",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: .8, ease: "power3.out", stagger: .1, delay: .12 },
      );
      gsap.fromTo(
        ".hero-art",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power3.out", delay: .28 },
      );

      gsap.utils.toArray<HTMLElement>(".services-section, .pricing-section, .process-section, .faq-section").forEach((section) => {
        const items = section.querySelectorAll(".reveal");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: .75,
            ease: "power3.out",
            stagger: .08,
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          },
        );
      });
    });

    return () => {
      context.revert();
      lenis.off("scroll", updateScroll);
      document.removeEventListener("click", handleAnchorNavigation);
      lenis.destroy();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return null;
}
