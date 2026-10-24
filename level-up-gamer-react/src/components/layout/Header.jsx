import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LevelUp } from "../../services/tienda.js";

export default function Header() {
  const [cantidadProductos, setCantidadProductos] = useState(() =>
    LevelUp.Carrito.contarUnidades(),
  );

  useEffect(() => {
    const actualizarCantidad = () => {
      setCantidadProductos(LevelUp.Carrito.contarUnidades());
    };

    // Actualizar si otra pestaña modifica el carrito.
    window.addEventListener("storage", actualizarCantidad);

    // Actualizar cuando el usuario vuelve a esta pestaña.
    window.addEventListener("focus", actualizarCantidad);

    // Actualizar cuando React añade o modifica productos en el carrito.
    window.addEventListener("lug-cart-updated", actualizarCantidad);

    return () => {
      window.removeEventListener("storage", actualizarCantidad);
      window.removeEventListener("focus", actualizarCantidad);
      window.removeEventListener("lug-cart-updated", actualizarCantidad);
    };
  }, []);

  return (
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
        <ul className="enlaces-nav">
          <li>
            <Link to="/login">Iniciar sesión</Link>
          </li>
          <li>
            <Link to="/registro">Registrarse</Link>
          </li>
        </ul>

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

          <Link to="/perfil" className="icono-perfil" aria-label="Ver perfil">
            👤
          </Link>
        </div>
      </div>
    </header>
  );
}
