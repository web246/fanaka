export function initCarousels() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    if (carousel.hasAttribute("data-carousel-3d")) return;

    const track = carousel.querySelector("[data-carousel-track]");
    const toggle = carousel.querySelector("[data-carousel-toggle]");
    const directionButtons = carousel.querySelectorAll(
      "[data-carousel-direction]",
    );
    if (!track || track.dataset.ready === "true") return;

    const originalCards = [...track.children];
    if (!originalCards.length) return;
    track.dataset.ready = "true";

    if (reducedMotion.matches) {
      carousel.classList.add("is-static");
      return;
    }

    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
      clone
        .querySelectorAll("a, button, input, select, textarea, [tabindex]")
        .forEach((node) => {
          node.setAttribute("tabindex", "-1");
        });
      track.append(clone);
    });

    let manuallyPaused = reducedMotion.matches;
    let onScreen = true;

    const setPlayback = () => {
      const paused = manuallyPaused || !onScreen || reducedMotion.matches;
      track.style.animationPlayState = paused ? "paused" : "running";
      if (toggle) {
        toggle.textContent = manuallyPaused ? "▶" : "Ⅱ";
        toggle.setAttribute("aria-pressed", String(manuallyPaused));
        toggle.setAttribute(
          "aria-label",
          manuallyPaused ? "Resume carousel" : "Pause carousel",
        );
        toggle.title = manuallyPaused ? "Resume motion" : "Pause motion";
      }
      carousel.classList.toggle("is-paused", paused);
    };

    toggle?.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      setPlayback();
    });
    directionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        track.style.animationDirection = button.dataset.carouselDirection;
      });
    });
    reducedMotion.addEventListener?.("change", (event) => {
      manuallyPaused = event.matches;
      setPlayback();
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        setPlayback();
      });
      observer.observe(carousel);
    }

    const halfWidth = track.scrollWidth / 2;
    const duration = Math.max(24, halfWidth / 32);
    track.style.setProperty("--carousel-duration", `${duration}s`);
    carousel.classList.add("is-ready");
    setPlayback();
  });
}
