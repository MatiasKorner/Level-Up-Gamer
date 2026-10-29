import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import LevelUp from "../../services/tienda.js";
import "../../css/layout.css";

const EVENTOS_CARRITO = ["lug-carrito-actualizado", "lug-cart-updated"];

export default function Header() {
  const haySesion = useSesion();
  const { pathname } = useLocation();

  const cerrarModalRef = useRef(null);
  const menuRef = useRef(null);
  const togglerRef = useRef(null);

  const [cantidadProductos, setCantidadProductos] = useState(() =>
    LevelUp.Carrito.contarUnidades(),
  );

  // Contador del carrito
  useEffect(() => {
    const actualizarCantidad = () => {
      setCantidadProductos(LevelUp.Carrito.contarUnidades());
    };

    window.addEventListener("storage", actualizarCantidad);
    window.addEventListener("focus", actualizarCantidad);
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

  // En móvil, cierra el menú desplegable al cambiar de página
  useEffect(() => {
    if (menuRef.current?.classList.contains("show")) {
      togglerRef.current?.click();
    }
  }, [pathname]);

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
            <header className="lu-header">
        <nav className="navbar navbar-expand-xl" data-bs-theme="dark">
          {/* El container alinea el header con el contenido de las páginas */}
          <div className="container">
            <Link to="/" className="navbar-brand lu-logo">
              LEVEL-<span>UP</span>
            </Link>

            {/* Carrito, perfil y hamburguesa: siempre visibles */}
            <div className="d-flex align-items-center gap-3 ms-auto order-xl-3">
              <Link
                to="/carrito"
                className="lu-icono position-relative"
                aria-label={`Ver carrito, ${cantidadProductos} productos`}
              >
                🛒
                <span
                  id="cart-count-badge"
                  className="lu-badge badge rounded-pill position-absolute top-0 start-100 translate-middle"
                >
                  {cantidadProductos}
                </span>
              </Link>

              {haySesion ? (
                <Link to="/perfil" className="lu-icono" aria-label="Ver perfil">
                  👤
                </Link>
              ) : (
                // Sin sesión: abre el modal en vez de ir al perfil
                <a
                  href="#"
                  className="lu-icono"
                  aria-label="Ver perfil"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-perfil-invitado"
                >
                  👤
                </a>
              )}

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#menu-principal"
                aria-controls="menu-principal"
                aria-expanded="false"
                aria-label="Abrir menú"
                ref={togglerRef}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            {/* Enlaces: en móvil bajan a una columna desplegable */}
            <div
              className="collapse navbar-collapse order-xl-2"
              id="menu-principal"
              ref={menuRef}
            >
              <ul className="navbar-nav lu-nav-principal me-xl-auto">
                <li className="nav-item">
                  <NavLink to="/" end className="nav-link">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/catalogo" className="nav-link">
                    Catálogo
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/blog" className="nav-link">
                    Blog
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/soporte" className="nav-link">
                    Soporte
                  </NavLink>
                </li>
              </ul>

              {!haySesion && (
                <ul className="navbar-nav lu-nav-sesion">
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Iniciar sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/registro" className="nav-link">
                      Registrarse
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Modal para invitados */}
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
