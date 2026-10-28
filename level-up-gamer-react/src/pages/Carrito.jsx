import { useState } from "react";
import { Link } from "react-router-dom";
import { LevelUp } from "../services/tienda.js";
import ItemCarrito from "../components/ItemCarrito.jsx";

import "../css/estilos.css";
import "../css/compras.css";
import "../css/base.css";
import "../css/componentes.css";
import "../css/inicio.css";

export default function Carrito() {
  // se carga el carrito guardado en localStorage al abrir la página.
  const [items, setItems] = useState(() =>
    LevelUp.Carrito.obtenerItems()
  );

  // se calculan los totales usando la lógica original de la tienda.
  const totales = LevelUp.Carrito.calcularTotales();
  const cantidadProductos = LevelUp.Carrito.contarUnidades();

  // Actualiza el estado de React después de modificar localStorage.
  function actualizarVista() {
    setItems(LevelUp.Carrito.obtenerItems());

    // Notifica al Header para actualizar el contador del carrito.
    window.dispatchEvent(new Event("lug-cart-updated"));
  }

  // Aumenta o disminuye la cantidad de un producto.
  function cambiarCantidad(id, cambio) {
    const producto = items.find((item) => item.id === id);

    if (!producto) return;

    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad <= 0) {
      LevelUp.Carrito.eliminar(id);
    } else {
      LevelUp.Carrito.actualizarCantidad(id, nuevaCantidad);
    }

    actualizarVista();
  }

  // Elimina un producto del carrito.
  function eliminarProducto(id) {
    const producto = items.find((item) => item.id === id);

    if (!producto) return;

    LevelUp.Carrito.eliminar(id);
    actualizarVista();

    LevelUp.toast(`${producto.nombre} eliminado del carrito`);
  }

  return (
    <>
      <div className="app-shell">
        <header className="topbar">
          <Link
            to="/catalogo"
            className="back-arrow"
            aria-label="Volver al catálogo"
          >
            &larr;
          </Link>

          <h1 className="page-title">Mi Carrito</h1>
        </header>

        <main className="container px-3 pb-5">
          <p className="subtitulo-pagina" id="carrito-subtitulo">
            {cantidadProductos} producto
            {cantidadProductos === 1 ? "" : "s"}
            {totales.esDuoc
              ? " · Descuento Duoc 20% aplicado"
              : ""}
          </p>

          {/* Productos del carrito: cada fila es un componente ItemCarrito */}
          <div id="carrito-lista">
            {items.map((item) => (
              <ItemCarrito
                key={item.id}
                item={item}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarProducto}
              />
            ))}
          </div>

          {/* Mensaje cuando no hay productos */}
          {items.length === 0 && (
            <div id="carrito-vacio" className="sin-resultados">
              Tu carrito está vacío.{" "}
              <Link to="/catalogo" className="enlace-registro">
                Ver catálogo &rarr;
              </Link>
            </div>
          )}

          {/* Resumen de compra: solo se muestra si hay productos */}
          {items.length > 0 && (
            <div id="carrito-con-items">
              {totales.esDuoc && (
                <div className="promo-box" id="beneficio-duoc">
                  <p>🎓 Beneficio Duoc UC: 20% de descuento</p>
                </div>
              )}

              <div className="summary-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{LevelUp.formatCLP(totales.subtotal)}</span>
                </div>

                <div className="summary-row descuento">
                  <span>
                    {totales.esDuoc
                      ? "Descuento Duoc (20%)"
                      : "Descuento"}
                  </span>

                  <span>
                    -{LevelUp.formatCLP(totales.descuento)}
                  </span>
                </div>

                <div className="summary-row envio">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>{LevelUp.formatCLP(totales.total)}</span>
                </div>
              </div>

              <Link
                to="/pago"
                className="btn btn-primary w-100 fw-bold text-uppercase py-2"
                id="btn-proceder"
              >
                Proceder al pago &rarr;
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
