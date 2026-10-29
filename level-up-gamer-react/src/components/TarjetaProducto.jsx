import { Link } from "react-router-dom";

function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-CL")} CLP`;
}

// Muestra un producto del catálogo. No guarda datos: todo le llega por props.
export default function TarjetaProducto({ producto }) {
  return (
    <div className="tarjeta" data-categoria={producto.categorias}>
      <img
        src={`/img/${producto.imagen}`}
        alt={producto.alt}
        className="imagen-tarjeta"
      />

      <div className="titulo-tarjeta">{producto.nombre}</div>

      <div className="precio-tarjeta">{formatearPrecio(producto.precio)}</div>

      <Link
        to={`/detalle?id=${encodeURIComponent(producto.id)}`}
        className="boton-azul"
      >
        Ver Detalle
      </Link>
    </div>
  );
}