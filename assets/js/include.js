export async function includePartials(root = "") {
  const slots = [
    ["header-slot", "partials/header.html"],
    ["footer-slot", "partials/footer.html"],
  ];
  await Promise.all(
    slots.map(async ([id, path]) => {
      const slot = document.getElementById(id);
      if (!slot) return;
      const response = await fetch(`${root}${path}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Could not load ${path}`);
      slot.innerHTML = (await response.text()).replaceAll("{{root}}", root);
    }),
  );
}
