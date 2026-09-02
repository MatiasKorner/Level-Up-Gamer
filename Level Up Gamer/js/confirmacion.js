/* confirmacion.js — Lógica de la página confirmacion.html (08) */

document.addEventListener("DOMContentLoaded", () => {
  const idAVer = LevelUp.leerPedidoAVer();
  const pedido = (idAVer && LevelUp.Pedidos.obtenerPorId(idAVer)) || LevelUp.leerPedidoEnCurso() || LevelUp.Pedidos.obtenerTodos()[0];

  sessionStorage.removeItem("lug_ver_pedido");

  if (!pedido) {
    window.location.href = "pedidos.html";
    return;
  }

  const fecha = new Date(pedido.fecha + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  document.getElementById("dato-id").textContent = pedido.id;
  document.getElementById("dato-fecha").textContent = fecha;
  document.getElementById("dato-total").textContent = LevelUp.formatCLP(pedido.total);
  document.getElementById("dato-entrega").textContent = pedido.entregaEstimada || "3 - 5 días hábiles";
  document.getElementById("dato-pago").textContent = pedido.pago || "Webpay Débito";
  document.getElementById("dato-puntos").textContent =
    "+" + (pedido.puntosGanados || Math.round(pedido.total / 80)).toLocaleString("es-CL") + " Puntos LevelUp ganados 🌟";
});
