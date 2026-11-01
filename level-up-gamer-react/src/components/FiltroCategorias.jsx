// FiltroCategorias: fila de botones para elegir una categoría; recibe la lista y la categoría activa, y avisa al padre cuál se eligió.
// No guarda datos: todo le llega por props (igual que TarjetaProducto).
export default function FiltroCategorias({ categorias = [], activa, onSeleccionar }) {
  return (
    <div className="filtros-categoria">
      {categorias.map((categoria) => {
        const esActiva = categoria.valor === activa;

        return (
          <button
            key={categoria.valor}
            type="button"
            className={`boton-azul ${esActiva ? "" : "boton-borde"}`}
            aria-pressed={esActiva}
            onClick={() => onSeleccionar(categoria.valor)}
          >
            {categoria.texto}
          </button>
        );
      })}
    </div>
  );
}