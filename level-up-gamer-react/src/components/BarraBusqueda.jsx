// BarraBusqueda catalogo: campo de búsqueda con ícono de lupa; muestra el texto recibido y avisa al padre el texto escrito (no el evento).
export default function BarraBusqueda({ valor, onCambiar, placeholder = "Buscar..." }) {
  return (
    <div className="grupo-campo-busqueda">
      <span className="icono-busqueda">🔍</span>
      <input
        type="text"
        className="campo-busqueda"
        placeholder={placeholder}
        aria-label={placeholder}
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
      />
    </div>
  );
}