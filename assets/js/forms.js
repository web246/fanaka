export function initForms() {
  document.querySelectorAll("[data-local-form]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const message = document.createElement("p");
      message.className = "notice";
      message.setAttribute("role", "status");
      message.textContent =
        window.FanakaTranslate?.("form.success") ||
        "Thank you for your interest.";
      form.replaceWith(message);
    }),
  );
}
