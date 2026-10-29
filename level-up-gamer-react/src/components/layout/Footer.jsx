import { Link } from "react-router-dom";
import "../../css/layout.css";

export default function Footer() {
  return (
    <footer className="lu-footer pt-5">
      <div className="container">
        <div className="row g-4">
          {/* Columna 1: logo y descripción */}
          <div className="col-12 col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src="/img/logo-Level-Up.png"
                alt="Level-Up Logo"
                height="40"
              />
              <h3 className="lu-logo fs-5 mb-0">
                LEVEL-<span>UP</span>
              </h3>
            </div>
            <p className="mb-0">
              Tu tienda de confianza para equipamiento gamer, PCs de alto
              rendimiento y periféricos al mejor precio.
            </p>
          </div>

          {/* Columna 2: navegación rápida */}
          <div className="col-6 col-md-4 col-lg-2">
            <h4>Navegación</h4>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/">Inicio</Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: soporte y ayuda */}
          <div className="col-6 col-md-4 col-lg-3">
            <h4>Soporte</h4>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/soporte">Centro de Ayuda</Link>
              </li>
              <li className="mb-2">
                <Link to="/soporte">Preguntas Frecuentes</Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: contacto */}
          <div className="col-12 col-md-4 col-lg-3">
            <h4>Contacto</h4>
            <p className="mb-2">Email: levelup_gamer@gmail.cl</p>
            <p className="mb-0">Santiago, Chile</p>
          </div>
        </div>
      </div>

      <div className="lu-footer-creditos mt-4 py-3 text-center small">
        <p className="mb-0">
          &copy; 2026 Level-Up Gamer. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}