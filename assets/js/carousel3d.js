const AUTO_ADVANCE_MS = 4000;
const DRAG_THRESHOLD = 45;
const activeCarousels = new Set();

export function init3dCarousels() {
  activeCarousels.forEach((entry) => {
    if (entry.carousel.isConnected) return;
    entry.destroy();
    activeCarousels.delete(entry);
  });

  document.querySelectorAll("[data-carousel-3d]").forEach((carousel) => {
    const viewport = carousel.querySelector(".carousel__viewport");
    const track = carousel.querySelector("[data-carousel-track]");
    const controls = carousel.querySelector(".carousel__controls");
    const previous = carousel.querySelector(
      '[data-carousel-direction="reverse"]',
    );
    const next = carousel.querySelector(
      '[data-carousel-direction="normal"]',
    );
    const toggle = carousel.querySelector("[data-carousel-toggle]");
    const cards = track ? [...track.children] : [];

    if (
      !viewport ||
      !track ||
      !controls ||
      !previous ||
      !next ||
      !toggle ||
      !cards.length ||
      carousel.dataset.carousel3dReady === "true"
    ) {
      return;
    }

    carousel.dataset.carousel3dReady = "true";
    carousel.classList.add("carousel--3d");

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      carousel.classList.add("carousel--3d-static");
      reducedMotion.addEventListener(
        "change",
        (event) => {
          if (event.matches) return;
          carousel.classList.remove("carousel--3d-static");
          delete carousel.dataset.carousel3dReady;
          init3dCarousels();
        },
        { once: true },
      );
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const originalTabIndexes = new Map(
      cards.flatMap((card) =>
        [...card.querySelectorAll("a, button, input, select, textarea, [tabindex]")].map(
          (element) => [element, element.getAttribute("tabindex")],
        ),
      ),
    );
    const dots = document.createElement("div");
    dots.className = "carousel-3d-dots";
    dots.setAttribute("role", "group");
    dots.setAttribute("aria-label", "Choose a card");
    const dotButtons = cards.map((card, index) => {
      const button = document.createElement("button");
      const title = card.querySelector("h3")?.textContent.trim();
      button.type = "button";
      button.className = "carousel-3d-dot";
      button.setAttribute("aria-label", `Show card ${index + 1}${title ? `: ${title}` : ""}`);
      button.addEventListener("click", () => goTo(index), { signal });
      dots.append(button);
      return button;
    });
    controls.after(dots);

    let activeIndex = 0;
    let timer;
    let isVisible = true;
    let isPaused = false;
    let startX = 0;
    let dragging = false;
    let dragged = false;

    const offsetFromActive = (index) => {
      let offset = (index - activeIndex) % cards.length;
      if (offset > cards.length / 2) offset -= cards.length;
      if (offset < -cards.length / 2) offset += cards.length;
      return offset;
    };

    const render = () => {
      if (reducedMotion.matches) return;
      cards.forEach((card) => card.style.removeProperty("width"));
      const availableWidth = viewport.clientWidth * 0.82;
      const cardWidth = Math.min(
        availableWidth,
        ...cards.map((card) => Number.parseFloat(getComputedStyle(card).width)),
      );
      const gap = cardWidth * (window.innerWidth < 640 ? 1.1 : 1.05);

      cards.forEach((card) => {
        card.style.width = `${cardWidth}px`;
      });
      const cardHeight = Math.max(
        ...cards.map((card) => card.getBoundingClientRect().height),
      );
      track.style.height = `${cardHeight}px`;

      cards.forEach((card, index) => {
        const offset = offsetFromActive(index);
        const distance = Math.abs(offset);
        const hidden = distance > 2;
        card.style.marginLeft = `${-cardWidth / 2}px`;
        card.style.transform = `translateX(${offset * gap}px) translateZ(${-distance * 130}px) rotateY(${-offset * 30}deg) scale(${1 - distance * 0.07})`;
        card.style.opacity = hidden ? "0" : String(1 - distance * 0.2);
        card.style.zIndex = String(10 - distance);
        card.style.pointerEvents = hidden ? "none" : "auto";
        card.setAttribute("aria-hidden", String(offset !== 0));
        originalTabIndexes.forEach((tabIndex, element) => {
          if (!card.contains(element)) return;
          if (offset !== 0) {
            element.setAttribute("tabindex", "-1");
          } else if (tabIndex === null) {
            element.removeAttribute("tabindex");
          } else {
            element.setAttribute("tabindex", tabIndex);
          }
        });
      });
      dotButtons.forEach((button, index) => {
        if (index === activeIndex) {
          button.setAttribute("aria-current", "true");
        } else {
          button.removeAttribute("aria-current");
        }
      });
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };

    const start = () => {
      stop();
      if (
        isPaused ||
        !isVisible ||
        document.hidden ||
        reducedMotion.matches
      ) {
        return;
      }
      timer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % cards.length;
        render();
      }, AUTO_ADVANCE_MS);
    };

    function goTo(index) {
      activeIndex = (index + cards.length) % cards.length;
      render();
      start();
    }

    previous.addEventListener("click", () => goTo(activeIndex - 1), { signal });
    next.addEventListener("click", () => goTo(activeIndex + 1), { signal });
    toggle.addEventListener("click", () => {
      isPaused = !isPaused;
      toggle.textContent = isPaused ? "▶" : "Ⅱ";
      toggle.setAttribute("aria-pressed", String(isPaused));
      toggle.setAttribute("aria-label", isPaused ? "Resume carousel" : "Pause carousel");
      toggle.title = isPaused ? "Resume motion" : "Pause motion";
      start();
    }, { signal });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      startX = event.clientX;
      dragging = true;
      dragged = false;
    }, { signal });
    window.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > DRAG_THRESHOLD) {
        dragged = true;
        goTo(activeIndex + (distance < 0 ? 1 : -1));
        window.setTimeout(() => {
          dragged = false;
        }, 0);
      }
    }, { signal });
    viewport.addEventListener(
      "click",
      (event) => {
        if (dragged) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (event.target.closest(".card")) return;
        const rect = viewport.getBoundingClientRect();
        const direction =
          event.clientX < rect.left + rect.width / 2 ? -1 : 1;
        const nearestCard = cards.findIndex(
          (_, index) => offsetFromActive(index) === direction,
        );
        if (nearestCard >= 0) goTo(nearestCard);
      },
      { capture: true, signal },
    );
    cards.forEach((card, index) => {
      card.addEventListener(
        "click",
        (event) => {
          if (index === activeIndex) return;
          event.preventDefault();
          event.stopPropagation();
          goTo(index);
        },
        { capture: true, signal },
      );
    });
    viewport.addEventListener(
      "dragstart",
      (event) => event.preventDefault(),
      { signal },
    );

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(viewport);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      start();
    });
    visibilityObserver.observe(carousel);
    document.addEventListener("visibilitychange", start, { signal });
    reducedMotion.addEventListener("change", (event) => {
      carousel.classList.toggle("carousel--3d-static", event.matches);
      if (event.matches) {
        stop();
        cards.forEach((card) => {
          card.removeAttribute("aria-hidden");
          card.removeAttribute("style");
        });
        originalTabIndexes.forEach((tabIndex, element) => {
          if (tabIndex === null) {
            element.removeAttribute("tabindex");
          } else {
            element.setAttribute("tabindex", tabIndex);
          }
        });
        track.removeAttribute("style");
        dots.remove();
      } else {
        dots.remove();
        controls.after(dots);
        render();
        start();
      }
    }, { signal });

    activeCarousels.add({
      carousel,
      destroy() {
        stop();
        controller.abort();
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
      },
    });
    render();
  });
}
