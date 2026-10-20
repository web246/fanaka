const consentKey = "fanaka-cookie-consent";
const version = 1;
function persistConsent(consent) {
  const record = { ...consent, version, updated: new Date().toISOString() };
  localStorage.setItem(consentKey, JSON.stringify(record));
  document.cookie = `fanaka_consent=${encodeURIComponent(JSON.stringify(record))}; max-age=31536000; path=/; SameSite=Lax`;
  document.dispatchEvent(new CustomEvent("fanaka:consent", { detail: record }));
  return record;
}
export function initCookies() {
  const banner = document.querySelector("[data-cookie-banner]");
  const modal = document.querySelector("[data-cookie-modal]");
  const read = () => {
    try {
      const data = JSON.parse(localStorage.getItem(consentKey));
      return data?.version === version ? data : null;
    } catch {
      return null;
    }
  };
  const current = read();
  if (!current && banner) banner.classList.add("is-visible");
  const closeModal = () => modal?.classList.remove("is-open");
  document.querySelectorAll("[data-cookie-settings]").forEach((button) =>
    button.addEventListener("click", () => {
      const value = read();
      modal?.querySelectorAll("[data-cookie-category]").forEach((input) => {
        input.checked = Boolean(value?.[input.dataset.cookieCategory]);
      });
      modal?.classList.add("is-open");
      modal?.querySelector("button")?.focus();
    }),
  );
  document
    .querySelector("[data-cookie-accept]")
    ?.addEventListener("click", () => {
      persistConsent({ necessary: true, analytics: true, marketing: true });
      banner?.classList.remove("is-visible");
    });
  document
    .querySelector("[data-cookie-reject]")
    ?.addEventListener("click", () => {
      persistConsent({ necessary: true, analytics: false, marketing: false });
      banner?.classList.remove("is-visible");
    });
  document
    .querySelector("[data-cookie-save]")
    ?.addEventListener("click", () => {
      const choices = Object.fromEntries(
        [...modal.querySelectorAll("[data-cookie-category]")].map((input) => [
          input.dataset.cookieCategory,
          input.checked,
        ]),
      );
      persistConsent({ necessary: true, ...choices });
      banner?.classList.remove("is-visible");
      closeModal();
    });
  document
    .querySelector("[data-cookie-close]")
    ?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
}
