import { includePartials } from "./include.js";
import { initLanguage } from "./i18n.js";
import { initNavigation } from "./nav.js";
import { initCookies } from "./cookies.js";
import { initForms } from "./forms.js";
import { initCalculators } from "./calculators.js";
import { initAnimations } from "./animations.js";
import { initHeroScene } from "./three-scene.js";
import { renderPage } from "./pages.js";
import { initTransitions } from "./transitions.js";
import { initHeroSlider } from "./hero-slider.js";
import { initCarousels } from "./carousels.js";

const root = document.body.dataset.root || "";

async function startSite() {
  await includePartials(root);
  await initLanguage(root);
  document.addEventListener("fanaka:content-ready", (event) => {
    if (event.detail?.page === "home") {
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
  initHeroScene();
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
