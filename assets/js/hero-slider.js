const slides = [
  ["hero.slide1Title", "hero.slide1Copy"],
  ["hero.slide2Title", "hero.slide2Copy"],
  ["hero.slide3Title", "hero.slide3Copy"],
];
let autoplayTimer;
let copyTimer;
let restartAutoplay = () => {};
let documentListenersBound = false;

export function initHeroSlider() {
  const copy = document.querySelector("[data-hero-copy]");
  const title = document.querySelector("[data-hero-title]");
  const description = document.querySelector("[data-hero-description]");
  const buttons = [...document.querySelectorAll("[data-hero-slide]")];
  if (!copy || !title || !description || buttons.length !== slides.length)
    return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let activeSlide = 0;
  window.clearInterval(autoplayTimer);

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    const [titleKey, copyKey] = slides[activeSlide];
    window.clearTimeout(copyTimer);
    copy.classList.add("is-changing");

    copyTimer = window.setTimeout(() => {
      title.textContent = window.FanakaTranslate?.(titleKey) || titleKey;
      description.textContent = window.FanakaTranslate?.(copyKey) || copyKey;
      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === activeSlide;
        button.setAttribute("aria-pressed", String(selected));
        button.setAttribute(
          "aria-label",
          `${window.FanakaTranslate?.("hero.slideSelect") || "Show message"} ${buttonIndex + 1}`,
        );
      });
      copy.classList.remove("is-changing");
    }, 180);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion.matches || document.hidden) return;
    autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 6200);
  }
  restartAutoplay = startAutoplay;

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      window.clearTimeout(copyTimer);
      showSlide(index);
      startAutoplay();
    });
  });

  copy.addEventListener("focusin", stopAutoplay);
  copy.addEventListener("focusout", startAutoplay);
  if (!documentListenersBound) {
    documentListenersBound = true;
    document.addEventListener("visibilitychange", () => restartAutoplay());
    reducedMotion.addEventListener?.("change", () => restartAutoplay());
  }

  showSlide(0);
  startAutoplay();
}
