import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// DOM motion for the landing page. Loaded lazily by MotionLayer, never on listing/detail pages.
// Everything is opt-in through data attributes, so server components stay free of client code:
//   data-reveal         fade + rise when scrolled into view (data-reveal-delay="0.1" optional)
//   data-split          children .word slide up out of their masks (see SplitWords)
//   data-scrub-words    .word elements light up one by one, scrubbed by scroll
//   data-parallax       image drifts slower than the page (value = strength in %)
//   data-magnetic       element leans towards the pointer
//   data-count          number counts up from 0 when scrolled into view
export function startAnimations(): () => void {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cleanups: (() => void)[] = [];

  const context = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        y: 36,
        autoAlpha: 0,
        duration: 1.1,
        delay: Number(element.dataset.revealDelay ?? 0),
        ease: "expo.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((element) => {
      // Inside a sticky story scene the heading is on screen long before its panel fades in,
      // so wait for the scene itself to reach the top of the viewport.
      const scene = element.closest<HTMLElement>(".story-scene");
      gsap.from(element.querySelectorAll(".word"), {
        yPercent: 115,
        rotate: 4,
        duration: 1.2,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: scene ?? element, start: scene ? "top top" : "top 85%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((element) => {
      gsap.fromTo(
        element.querySelectorAll(".word"),
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: element.closest("section") ?? element,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
      const strength = Number(element.dataset.parallax || 10);
      gsap.fromTo(
        element,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: "none",
          scrollTrigger: { trigger: element.parentElement ?? element, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);
      const decimals = (element.dataset.count?.split(".")[1] ?? "").length;
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 90%", once: true },
        onUpdate: () => {
          element.textContent = counter.value.toFixed(decimals);
        },
      });
    });
  });

  if (finePointer) {
    gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((element) => {
      const moveX = gsap.quickTo(element, "x", { duration: 0.5, ease: "power3.out" });
      const moveY = gsap.quickTo(element, "y", { duration: 0.5, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        moveX((event.clientX - (box.left + box.width / 2)) * 0.3);
        moveY((event.clientY - (box.top + box.height / 2)) * 0.3);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
        gsap.set(element, { clearProps: "transform" });
      });
    });
  }

  // Story sections change height once fonts load; keep trigger positions accurate.
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  cleanups.push(() => window.removeEventListener("load", refresh));

  return () => {
    for (const cleanup of cleanups) cleanup();
    context.revert();
  };
}
