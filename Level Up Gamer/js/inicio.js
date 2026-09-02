/* inicio.js — Conecta los botones "+" de index.html (01) con el carrito real */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-button[data-id]").forEach((btn) =>
    btn.addEventListener("click", () => {
      LevelUp.Carrito.agregar({
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        variante: btn.dataset.variante,
        precio: Number(btn.dataset.precio),
        cantidad: 1,
        img: btn.dataset.img,
      });
      LevelUp.toast(`${btn.dataset.nombre} agregado al carrito`);

      const badge = document.getElementById("cart-count-badge");
      if (badge) badge.textContent = LevelUp.Carrito.contarUnidades();
    })
  );
});
