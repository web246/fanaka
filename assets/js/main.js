import { includePartials } from "./include.js?v=fanaka-brand";
import { initLanguage } from "./i18n.js";
import { initNavigation } from "./nav.js?v=fanaka-brand";
import { initCookies } from "./cookies.js";
import { initForms } from "./forms.js";
import { initCalculators } from "./calculators.js";
import { initAnimations } from "./animations.js";
import { renderPage } from "./pages.js?v=fanaka-contact-video";
import { initTransitions } from "./transitions.js";
import { initHeroSlider } from "./hero-slider.js";
import { initCarousels } from "./carousels.js";
import { init3dCarousels } from "./carousel3d.js";

const root = document.body.dataset.root || "";

function initLoopingVideo(video, description) {
  if (!video || video.dataset.playbackInitialized) return;
  video.dataset.playbackInitialized = "true";
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  const keepPlaying = () => {
    if (document.hidden) return;
    video.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error(`Unable to play the ${description}.`, error);
      }
    });
  };

  video.addEventListener("pause", keepPlaying);
  video.addEventListener("ended", keepPlaying);
  document.addEventListener("visibilitychange", keepPlaying);
  keepPlaying();
}

async function startSite() {
  await includePartials(root);
  await initLanguage(root);
  document.addEventListener("fanaka:content-ready", (event) => {
    if (event.detail?.page === "home") {
      initLoopingVideo(
        document.querySelector("[data-hero-video]"),
        "homepage hero video",
      );
      initLoopingVideo(
        document.querySelector("[data-difference-video]"),
        "Fanaka difference video",
      );
      initHeroSlider();
      initCarousels();
      init3dCarousels();
    } else if (event.detail?.page === "contact") {
      initLoopingVideo(
        document.querySelector("[data-contact-video]"),
        "Nairobi contact video",
      );
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
