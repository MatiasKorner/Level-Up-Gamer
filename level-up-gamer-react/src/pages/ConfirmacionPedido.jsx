import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LevelUp from "../services/tienda.js";
import "../css/estilos.css";
import "../css/compras.css";

// Mismo orden de prioridad que el confirmacion.js original:
// 1) pedido que se quiere ver (desde "Rastrear"), 2) pedido recién pagado,
// 3) el pedido más reciente del historial
function obtenerPedido() {
  const idAVer = LevelUp.leerPedidoAVer();
  return (
    (idAVer && LevelUp.Pedidos.obtenerPorId(idAVer)) ||
    LevelUp.leerPedidoEnCurso() ||
    LevelUp.Pedidos.obtenerTodos()[0]
  );
}

export default function ConfirmacionPedido() {
  // Solo se LEE aquí; el borrado va en el efecto (ver más abajo)
  const [pedido] = useState(obtenerPedido);

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = "Level-Up Gamer - Pedido Confirmado";

    // El original lo borraba justo después de leerlo
    sessionStorage.removeItem("lug_ver_pedido");

    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  // Sin ningún pedido: al historial
  if (!pedido) return <Navigate to="/pedidos" replace />;

  const fecha = new Date(pedido.fecha + "T00:00:00").toLocaleDateString(
    "es-CL",
    { day: "2-digit", month: "long", year: "numeric" },
  );

  const puntosGanados = (
    pedido.puntosGanados || Math.round(pedido.total / 80)
  ).toLocaleString("es-CL");

  return (
    <div className="app-shell">
      <main className="container px-3 pb-5">
        <div className="confirmacion-wrap">
          <div className="circulo-exito">✓</div>
          <h1>¡Pedido confirmado!</h1>
          <p>
            Tu equipamiento gamer está en camino, ¡Jugador!
            <br />
            Prepárate para subir de nivel.
          </p>

          <div className="orden-card">
            <div className="fila">
              <span>N° de Pedido</span>
              <span id="dato-id">{pedido.id}</span>
            </div>
            <div className="fila">
              <span>Fecha</span>
              <span id="dato-fecha">{fecha}</span>
            </div>
            <div className="fila">
              <span>Total</span>
              <span id="dato-total">{LevelUp.formatCLP(pedido.total)}</span>
            </div>
            <div className="fila">
              <span>Entrega</span>
              <span id="dato-entrega">
                {pedido.entregaEstimada || "3 - 5 días hábiles"}
              </span>
            </div>
            <div className="fila">
              <span>Pago</span>
              <span id="dato-pago">{pedido.pago || "Webpay Débito"}</span>
            </div>
          </div>

          <div className="puntos-ganados" id="dato-puntos">
            +{puntosGanados} Puntos LevelUp ganados 🌟
          </div>

          <Link
            to="/pedidos"
            className="btn btn-confirmar w-100 fw-bold text-uppercase py-2 mt-4"
          >
            🔁 Rastrear mi pedido
          </Link>
          <Link
            to="/catalogo"
            className="btn btn-outline-light w-100 fw-bold text-uppercase py-2 mt-2"
          >
            Seguir comprando
          </Link>
        </div>
      </main>
    </div>
  );
}