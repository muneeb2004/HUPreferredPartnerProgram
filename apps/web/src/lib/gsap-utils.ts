import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP utilities and configuration for scroll-driven animations.
 * Safe to use in Next.js Server Components by wrapping inside useEffect.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const initScrollTrigger = (): void => {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
};

/**
 * Reusable scroll reveal generator
 */
export const createScrollReveal = (element: Element | string, options?: gsap.TweenVars): gsap.core.Tween => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
      ...options,
    }
  );
};

export { gsap, ScrollTrigger };
