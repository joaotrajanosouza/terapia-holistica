type ParallaxElement = HTMLElement & { __parallaxSpeed?: number };

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function getOffset(el: ParallaxElement, viewportHeight: number): number {
  const rect = el.getBoundingClientRect();
  const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
  const centered = progress - 0.5;
  const speed = el.__parallaxSpeed ?? 0.1;
  return centered * speed * viewportHeight;
}

export function initParallax(selector = '[data-parallax]'): () => void {
  if (prefersReducedMotion()) return () => {};

  const elements = Array.from(document.querySelectorAll<ParallaxElement>(selector));
  if (elements.length === 0) return () => {};

  for (const el of elements) {
    el.__parallaxSpeed = Number(el.dataset.speed ?? 0.1);
  }

  let ticking = false;
  let active = new Set<ParallaxElement>(elements);

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;

    for (const el of active) {
      el.style.transform = `translate3d(0, ${getOffset(el, vh).toFixed(2)}px, 0)`;
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as ParallaxElement;
        if (entry.isIntersecting) {
          active.add(el);
        } else {
          active.delete(el);
        }
      }
      requestUpdate();
    },
    { rootMargin: '20% 0px' }
  );

  for (const el of elements) observer.observe(el);

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();

  return () => {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    observer.disconnect();
    for (const el of elements) {
      el.style.transform = '';
    }
  };
}
