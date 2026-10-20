export function initTransitions() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const panel = document.createElement("div");
  panel.className = "page-transition";
  panel.setAttribute("aria-hidden", "true");
  document.body.append(panel);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      link.origin !== location.origin ||
      link.target ||
      link.hasAttribute("download") ||
      link.pathname === location.pathname ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    event.preventDefault();
    document.body.classList.add("is-transitioning");
    window.setTimeout(() => location.assign(link.href), 430);
  });
}
