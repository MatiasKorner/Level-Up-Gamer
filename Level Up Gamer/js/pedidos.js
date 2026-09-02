/* pedidos.js — Lógica de la página pedidos.html (11) */

document.addEventListener("DOMContentLoaded", () => {
  const listaEl = document.getElementById("lista-pedidos");
  const sinPedidosEl = document.getElementById("sin-pedidos");
  let filtroActivo = "todos";

  const ETIQUETAS_ESTADO = {
    en_camino: "En camino",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };

  function formatearFecha(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
  }

  function render() {
    const todos = LevelUp.Pedidos.obtenerTodos();
    const filtrados = filtroActivo === "todos" ? todos : todos.filter((p) => p.estado === filtroActivo);

    if (filtrados.length === 0) {
      listaEl.innerHTML = "";
      sinPedidosEl.classList.remove("d-none");
      return;
    }
    sinPedidosEl.classList.add("d-none");

    listaEl.innerHTML = filtrados
      .map((p) => {
        const esEnCamino = p.estado === "en_camino";
        const accionTexto = esEnCamino ? "Rastrear" : "Repetir pedido";
        const accionTipo = esEnCamino ? "rastrear" : "repetir";
        return `
        <div class="order-card">
          <div class="cabecera">
            <strong>${p.id}</strong>
            <span class="order-status ${p.estado}">${ETIQUETAS_ESTADO[p.estado]}</span>
          </div>
          <p class="meta">${formatearFecha(p.fecha)} · ${p.items} producto${p.items === 1 ? "" : "s"}</p>
          <div class="pie">
            <span class="total">${LevelUp.formatCLP(p.total)}</span>
            <button type="button" class="accion-btn" data-accion="${accionTipo}" data-id="${p.id}">${accionTexto}</button>
          </div>
        </div>`;
      })
      .join("");
  }

  document.querySelectorAll(".order-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document.querySelectorAll(".order-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      filtroActivo = tab.dataset.filtro;
      render();
    })
  );

  listaEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-accion]");
    if (!btn) return;
    const pedido = LevelUp.Pedidos.obtenerPorId(btn.dataset.id);
    if (!pedido) return;

    if (btn.dataset.accion === "rastrear") {
      LevelUp.marcarPedidoAVer(pedido.id);
      window.location.href = "confirmacion.html";
    } else {
      (pedido.productos || []).forEach((p) => LevelUp.Carrito.agregar(Object.assign({}, p)));
      LevelUp.toast(`${pedido.id} agregado a tu carrito`);
      window.location.href = "carrito.html";
    }
  });

  render();
});
