import { LevelUp } from "../services/tienda.js";

// Muestra un producto del carrito. No guarda datos: todo le llega por props.
export default function ItemCarrito({ item, onCambiarCantidad, onEliminar }) {
  const imagen = item.img.startsWith("/") ? item.img : `/${item.img}`;

  return (
    <div className="cart-item" data-id={item.id}>
      <img src={imagen} alt={item.nombre} />

      <div className="cart-item-info">
        <h3>{item.nombre}</h3>
        <p className="variante">{item.variante}</p>
        <p className="precio">{LevelUp.formatCLP(item.precio * item.cantidad)}</p>
      </div>

      <div className="cart-item-actions">
        <button
          type="button"
          className="remove-btn"
          aria-label={`Eliminar ${item.nombre}`}
          onClick={() => onEliminar(item.id)}
        >
          🗑
        </button>

        <div className="qty-stepper">
          <button
            type="button"
            aria-label={`Disminuir cantidad de ${item.nombre}`}
            onClick={() => onCambiarCantidad(item.id, -1)}
          >
            -
          </button>

          <span>{item.cantidad}</span>

          <button
            type="button"
            aria-label={`Aumentar cantidad de ${item.nombre}`}
            onClick={() => onCambiarCantidad(item.id, 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}