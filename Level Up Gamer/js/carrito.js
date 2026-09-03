/* carrito.js — Lógica de la página carrito.html (06) */

document.addEventListener("DOMContentLoaded", () => {
  const listaEl = document.getElementById("carrito-lista");
  const vacioEl = document.getElementById("carrito-vacio");
  const conItemsEl = document.getElementById("carrito-con-items");
  const subtituloEl = document.getElementById("carrito-subtitulo");


  function render() {
    const items = LevelUp.Carrito.obtenerItems();
    const totales = LevelUp.Carrito.calcularTotales();
    const beneficioDuoc = document.getElementById("beneficio-duoc");

    if (totales.esDuoc) {
      beneficioDuoc.classList.remove("d-none");
    } else {
      beneficioDuoc.classList.add("d-none");
    }

    document.getElementById("cart-count-badge").textContent = LevelUp.Carrito.contarUnidades();

    if (items.length === 0) {
      listaEl.innerHTML = "";
      vacioEl.classList.remove("d-none");
      conItemsEl.classList.add("d-none");
      subtituloEl.textContent = "0 productos";
      return;
    }

    vacioEl.classList.add("d-none");
    conItemsEl.classList.remove("d-none");

    subtituloEl.textContent =
      LevelUp.Carrito.contarUnidades() +
      " producto" + (LevelUp.Carrito.contarUnidades() === 1 ? "" : "s") +
      (totales.esDuoc ? " · Descuento Duoc 20% aplicado" : "");

    listaEl.innerHTML = items
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.nombre}">
        <div class="cart-item-info">
          <h3>${item.nombre}</h3>
          <p class="variante">${item.variante}</p>
          <p class="precio">${LevelUp.formatCLP(item.precio * item.cantidad)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="remove-btn" aria-label="Eliminar ${item.nombre}" data-accion="eliminar">🗑</button>
          <div class="qty-stepper">
            <button type="button" data-accion="menos">-</button>
            <span>${item.cantidad}</span>
            <button type="button" data-accion="mas">+</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    document.getElementById("resumen-subtotal").textContent = LevelUp.formatCLP(totales.subtotal);
    document.getElementById("resumen-descuento-label").textContent =
      totales.esDuoc ? "Descuento Duoc (20%)" : "Descuento";
    document.getElementById("resumen-descuento").textContent = "-" + LevelUp.formatCLP(totales.descuento);
    document.getElementById("resumen-total").textContent = LevelUp.formatCLP(totales.total);

    
  }

  listaEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-accion]");
    if (!btn) return;
    const id = btn.closest(".cart-item").dataset.id;
    const items = LevelUp.Carrito.obtenerItems();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (btn.dataset.accion === "mas") {
      LevelUp.Carrito.actualizarCantidad(id, item.cantidad + 1);
    } else if (btn.dataset.accion === "menos") {
      if (item.cantidad <= 1) {
        LevelUp.Carrito.eliminar(id);
      } else {
        LevelUp.Carrito.actualizarCantidad(id, item.cantidad - 1);
      }
    } else if (btn.dataset.accion === "eliminar") {
      LevelUp.Carrito.eliminar(id);
      LevelUp.toast(`${item.nombre} eliminado del carrito`);
    }
    render();
  });

  render();
});
