const serviceGroups = [
  {
    title: "Pension",
    href: "retirement-planning.html",
    items: [
      "Pension Administration Services",
      "Umbrella Fund Solutions",
      "Personal Pension Plan",
      "Diaspora & Expatriates Fund",
      "Kesho Held Income Drawdown Fund",
      "Corporate Principal Officer",
      "Corporate Trustee",
      "Training Services",
    ],
  },
  {
    title: "Insurance",
    href: "insurance-advisory.html",
    items: [
      "Personal Insurance",
      "Corporate Insurance",
      "Comprehensive Motor Insurance",
      "Domestic Package Insurance",
    ],
  },
  {
    title: "Investments",
    href: "wealth-management.html",
    items: [
      "Enwealth Money Market Fund",
      "Enwealth Balanced Fund",
      "Enwealth Equity Fund",
      "Enwealth Fixed Income Fund",
      "Enwealth Dollar Money Market Fund",
      "Enwealth Capital Unit Trust Scheme FAQ's",
      "Information Memorandum",
    ],
  },
  {
    title: "Corporate Trustee",
    href: "corporate-advisory.html",
    items: [
      "Retirement Benefits Schemes",
      "Collective Investment Schemes",
      "Family Trusts",
      "ESOP Management",
      "Employee Benefits Trust",
      "Consulting & Advisory",
    ],
  },
];
export function initNavigation() {
  const header = document.getElementById("site-header");
  const path = location.pathname;
  const root = document.body.dataset.root || "";
  const menu = document.querySelector("[data-service-menu]");
  if (menu)
    menu.innerHTML = serviceGroups
      .map(
        (group) => `
          <section class="mega-column">
            <h2><a href="${root}services/${group.href}">${group.title}</a></h2>
            <ul>
              ${group.items
                .map(
                  (item) =>
                    `<li><a href="${root}services/${group.href}">${item}</a></li>`,
                )
                .join("")}
            </ul>
          </section>
        `,
      )
      .join("");
  const current =
    path.endsWith("/") || path.endsWith("index.html")
      ? "home"
      : path.split("/").pop().replace(".html", "");
  document
    .querySelector(`[data-nav="${current}"]`)
    ?.setAttribute("aria-current", "page");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const closeButton = nav?.querySelector(".menu-close");
  const setMenuOpen = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (!open) {
      document
        .querySelectorAll(".nav-group.is-open")
        .forEach((group) => group.classList.remove("is-open"));
      document
        .querySelectorAll(".services-trigger[aria-expanded='true']")
        .forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
      if (nav.contains(document.activeElement)) toggle.focus();
    } else {
      closeButton?.focus();
    }
  };
  toggle?.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  closeButton?.addEventListener("click", () => setMenuOpen(false));
  const services = document.querySelector(".services-trigger");
  services?.addEventListener("click", () => {
    const group = services.closest(".nav-group");
    const open = group.classList.toggle("is-open");
    services.setAttribute("aria-expanded", String(open));
  });
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      header?.classList.toggle("is-solid", y > 30);
    },
    { passive: true },
  );
  document.addEventListener("click", (event) => {
    if (
      nav?.classList.contains("is-open") &&
      !nav.contains(event.target) &&
      !toggle?.contains(event.target)
    ) {
      setMenuOpen(false);
    } else if (event.target instanceof Element && event.target.closest(".main-nav a")) {
      setMenuOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) {
      setMenuOpen(false);
      toggle?.focus();
    }
  });
}
