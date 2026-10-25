import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import LevelUp from "../../services/tienda.js";

const EVENTOS_CARRITO = ["lug-carrito-actualizado", "lug-cart-updated"];

export default function Header() {
  const haySesion = useSesion();
  const cerrarModalRef = useRef(null);

  const [cantidadProductos, setCantidadProductos] = useState(() =>
    LevelUp.Carrito.contarUnidades(),
  );

  // Contador del carrito
  useEffect(() => {
    const actualizarCantidad = () => {
      setCantidadProductos(LevelUp.Carrito.contarUnidades());
    };

    // Otra pestaña modifica el carrito
    window.addEventListener("storage", actualizarCantidad);
    // El usuario vuelve a esta pestaña
    window.addEventListener("focus", actualizarCantidad);
    // Este código añade o modifica productos
    EVENTOS_CARRITO.forEach((evento) =>
      window.addEventListener(evento, actualizarCantidad),
    );

    return () => {
      window.removeEventListener("storage", actualizarCantidad);
      window.removeEventListener("focus", actualizarCantidad);
      EVENTOS_CARRITO.forEach((evento) =>
        window.removeEventListener(evento, actualizarCantidad),
      );
    };
  }, []);

  // Si el header se desmonta con el modal abierto (login y registro están
  // fuera del Layout), limpia el fondo oscuro que deja Bootstrap
  useEffect(() => {
    return () => {
      document
        .querySelectorAll(".modal-backdrop")
        .forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
    };
  }, []);

  return (
    <>
      <header className="navegacion">
        <Link to="/" className="logotipo">
          LEVEL-<span>UP</span>
        </Link>

        <ul className="menu-principal">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/catalogo">Catálogo</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/soporte">Soporte</Link>
          </li>
        </ul>

        <div className="contenedor-derecho">
          {!haySesion && (
            <ul className="enlaces-nav">
              <li>
                <Link to="/login">Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/registro">Registrarse</Link>
              </li>
            </ul>
          )}

          <div className="iconos-nav">
            <Link
              to="/carrito"
              className="icono-carrito"
              aria-label={`Ver carrito, ${cantidadProductos} productos`}
            >
              🛒{" "}
              <span id="cart-count-badge" className="contador-carrito">
                {cantidadProductos}
              </span>
            </Link>

            {haySesion ? (
              <Link
                to="/perfil"
                className="icono-perfil"
                aria-label="Ver perfil"
              >
                👤
              </Link>
            ) : (
              // Sin sesión: abre el modal en vez de ir al perfil
              <a
                href="#"
                className="icono-perfil"
                aria-label="Ver perfil"
                data-bs-toggle="modal"
                data-bs-target="#modal-perfil-invitado"
              >
                👤
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Modal para invitados (antes lo creaba tienda.js con el DOM) */}
      <div
        className="modal fade"
        id="modal-perfil-invitado"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-black text-white border border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">👤 Cuenta Level-Up</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
                ref={cerrarModalRef}
              ></button>
            </div>

            <div className="modal-body text-center">
              <p className="mb-4">
                Debes iniciar sesión o crear una cuenta para acceder a tu
                perfil.
              </p>

              <div className="d-grid gap-2">
                <Link
                  to="/login"
                  className="btn btn-primary fw-bold"
                  onClick={() => cerrarModalRef.current?.click()}
                >
                  INICIAR SESIÓN
                </Link>

                <Link
                  to="/registro"
                  className="btn btn-outline-light fw-bold"
                  onClick={() => cerrarModalRef.current?.click()}
                >
                  CREAR CUENTA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}