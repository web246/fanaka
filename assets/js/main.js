import { includePartials } from "./include.js";
import { initLanguage } from "./i18n.js";
import { initNavigation } from "./nav.js";
import { initCookies } from "./cookies.js";
import { initForms } from "./forms.js";
import { initCalculators } from "./calculators.js";
import { initAnimations } from "./animations.js";
import { renderPage } from "./pages.js";
import { initTransitions } from "./transitions.js";
import { initHeroSlider } from "./hero-slider.js";
import { initCarousels } from "./carousels.js";

const root = document.body.dataset.root || "";

function initHeroVideo() {
  const video = document.querySelector("[data-hero-video]");
  if (!video) return;

  const keepPlaying = () => {
    if (video.ended) video.currentTime = 0;
    video.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Unable to play the homepage hero video.", error);
      }
    });
  };

  video.addEventListener("pause", keepPlaying);
  video.addEventListener("ended", keepPlaying);
  document.addEventListener("visibilitychange", keepPlaying);
  keepPlaying();
}

function initDifferenceVideo() {
  const video = document.querySelector("[data-difference-video]");
  if (!video) return;

  const keepPlaying = () => {
    video.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Unable to play the Fanaka difference video.", error);
      }
    });
  };

  video.addEventListener("pause", keepPlaying);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) keepPlaying();
  });
  keepPlaying();
}

async function startSite() {
  await includePartials(root);
  await initLanguage(root);
  document.addEventListener("fanaka:content-ready", (event) => {
    if (event.detail?.page === "home") {
      initHeroVideo();
      initDifferenceVideo();
      initHeroSlider();
      initCarousels();
    }
  });
  renderPage(root);
  initNavigation();
  initCookies();
  initForms();
  initCalculators();
  initAnimations();
  initTransitions();
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startSite, { once: true });
} else {
  startSite();
}
