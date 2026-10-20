export function initCalculators() {
  document.querySelectorAll("[data-growth-calculator]").forEach((form) => {
    const output = form.querySelector("[data-calculator-result]");
    const calculate = () => {
      const principal = Number(form.elements.principal.value) || 0;
      const monthly = Number(form.elements.monthly.value) || 0;
      const years = Math.max(0, Number(form.elements.years.value) || 0);
      const rate = (Number(form.elements.rate.value) || 0) / 1200;
      const months = years * 12;
      const result = rate
        ? principal * (1 + rate) ** months +
          monthly * (((1 + rate) ** months - 1) / rate)
        : principal + monthly * months;
      output.textContent = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
      }).format(result);
    };
    form.addEventListener("input", calculate);
    calculate();
  });
}
