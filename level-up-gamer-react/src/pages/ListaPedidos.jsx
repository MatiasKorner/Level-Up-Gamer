import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LevelUp from "../services/tienda.js";
import "../css/estilos.css";
import "../css/cuenta.css";

const FILTROS = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "en_camino", etiqueta: "En camino" },
  { valor: "entregado", etiqueta: "Entregado" },
  { valor: "cancelado", etiqueta: "Cancelado" },
];

const ETIQUETAS_ESTADO = {
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function formatearFecha(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ListaPedidos() {
  const navigate = useNavigate();
  const haySesion = Boolean(localStorage.getItem("lug_user"));

  // Sin sesión no se leen los pedidos (obtenerTodos crea datos de ejemplo)
  const [pedidos] = useState(() =>
    haySesion ? LevelUp.Pedidos.obtenerTodos() : [],
  );
  const [filtroActivo, setFiltroActivo] = useState("todos");

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = "Level-Up Gamer - Historial de Pedidos";
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  // Sin sesión iniciada: al login
  if (!haySesion) return <Navigate to="/login" replace />;

  const filtrados =
    filtroActivo === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroActivo);

  function manejarAccion(pedido) {
    if (pedido.estado === "en_camino") {
      // Rastrear
      LevelUp.marcarPedidoAVer(pedido.id);
      navigate("/confirmacion");
    } else {
      // Repetir pedido
      (pedido.productos || []).forEach((p) =>
        LevelUp.Carrito.agregar({ ...p }),
      );
      LevelUp.toast(`${pedido.id} agregado a tu carrito`);
      navigate("/carrito");
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/perfil" className="back-arrow" aria-label="Volver">
          ←
        </Link>
        <h1 className="page-title">Historial de Pedidos</h1>
        <span style={{ width: "1.3rem" }}></span>
      </header>

      <main className="container px-3 pb-5">
        <div className="order-tabs">
          {FILTROS.map((filtro) => (
            <button
              key={filtro.valor}
              type="button"
              className={`order-tab ${
                filtroActivo === filtro.valor ? "active" : ""
              }`}
              onClick={() => setFiltroActivo(filtro.valor)}
            >
              {filtro.etiqueta}
            </button>
          ))}
        </div>

        <div id="lista-pedidos">
          {filtrados.map((p) => (
            <div className="order-card" key={p.id}>
              <div className="cabecera">
                <strong>{p.id}</strong>
                <span className={`order-status ${p.estado}`}>
                  {ETIQUETAS_ESTADO[p.estado] ?? p.estado}
                </span>
              </div>

              <p className="meta">
                {formatearFecha(p.fecha)} · {p.items} producto
                {p.items === 1 ? "" : "s"}
              </p>

              <div className="pie">
                <span className="total">{LevelUp.formatCLP(p.total)}</span>
                <button
                  type="button"
                  className="accion-btn"
                  onClick={() => manejarAccion(p)}
                >
                  {p.estado === "en_camino" ? "Rastrear" : "Repetir pedido"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtrados.length === 0 && (
          <div id="sin-pedidos" className="sin-resultados">
            No hay pedidos en esta categoría.
          </div>
        )}
      </main>
    </div>
  );
}