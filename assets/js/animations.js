export function initAnimations() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = document.querySelectorAll("[data-reveal]");
  const tiltCards = document.querySelectorAll("[data-tilt]");

  tiltCards.forEach((card) => {
    if (reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${vertical * -5}deg`);
      card.style.setProperty("--tilt-y", `${horizontal * 6}deg`);
      card.style.setProperty("--glare-x", `${(horizontal + 0.5) * 100}%`);
      card.style.setProperty("--glare-y", `${(vertical + 0.5) * 100}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--glare-x");
      card.style.removeProperty("--glare-y");
    });
  });

  if (reduced || !("IntersectionObserver" in window)) {
    reveal.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  reveal.forEach((node) => observer.observe(node));
  document.querySelectorAll("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count) || 0;
    const counterObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const start = performance.now();
          const duration = 1000;
          const draw = (time) => {
            const progress = Math.min(1, (time - start) / duration);
            node.textContent = Math.round(
              target * (1 - (1 - progress) ** 3),
            ).toLocaleString();
            if (progress < 1) requestAnimationFrame(draw);
          };
          requestAnimationFrame(draw);
          counterObserver.disconnect();
        }),
      { threshold: 0.5 },
    );
    counterObserver.observe(node);
  });
}
