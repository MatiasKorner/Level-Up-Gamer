import { useEffect, useRef, useState } from "react";
import TarjetaProducto from "../components/TarjetaProducto.jsx";
import { obtenerProductos } from "../data/productos.js";

import "../css/base.css";
import "../css/componentes.css";
import "../css/inicio.css";
import "../css/catalogo.css";
import "../css/pie.css";

const categoriasPrincipales = [
  { valor: "todos", texto: "Todos" },
  { valor: "consolas", texto: "Consolas" },
  { valor: "computadores-gamers", texto: "Computadores" },
  { valor: "accesorios", texto: "Accesorios" },
];

const categoriasAdicionales = [
  { valor: "juegos-de-mesa", texto: "Juegos de mesa" },
  { valor: "sillas-gamer", texto: "Sillas gamer" },
  { valor: "mouse", texto: "Mouse" },
  { valor: "mousepad", texto: "Mousepad" },
  { valor: "poleras-polerones", texto: "Poleras y polerones" },
];

export default function Catalogo() {
  // Los productos vienen del archivo de datos (se leen una sola vez)
  const [productos] = useState(() => obtenerProductos());
  const [categoriaActual, setCategoriaActual] = useState("todos");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [criterioOrden, setCriterioOrden] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  const menuRef = useRef(null);
  const botonMasRef = useRef(null);

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    function cerrarMenu(evento) {
      if (
        menuRef.current &&
        !menuRef.current.contains(evento.target) &&
        !botonMasRef.current?.contains(evento.target)
      ) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener("click", cerrarMenu);

    return () => {
      document.removeEventListener("click", cerrarMenu);
    };
  }, []);

  // Esta función actualiza la categoría seleccionada
  function filtrarProductos(categoria) {
    setCategoriaActual(categoria);
    setCategoriaActiva(categoria);

    // Cierra el menú de los 3 puntos si estaba abierto
    setMenuAbierto(false);
  }

  // Filtrar las tarjetas
  const productosFiltrados = productos.filter((producto) => {
    // las categorías de la tarjeta
    // Ejemplo: "consolas tendencias" → ["consolas", "tendencias"]
    const cats = producto.categorias.toLowerCase().split(/\s+/);

    //el título del producto
    const titulo = producto.nombre.toLowerCase();

    // ¿Coincide con la categoría seleccionada?
    const coincideCategoria =
      categoriaActual === "todos" || cats.includes(categoriaActual);

    // ¿Coincide con el texto de búsqueda?
    const coincideBusqueda =
      textoBusqueda.trim() === "" ||
      titulo.includes(textoBusqueda.trim().toLowerCase());

    // Solo se queda si cumple AMBAS condiciones
    return coincideCategoria && coincideBusqueda;
  });

  // Ordenar las tarjetas filtradas
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    // Según la opción elegida, ordena de forma diferente
    switch (criterioOrden) {
      case "precio-menor":
        return a.precio - b.precio; // de menor a mayor

      case "precio-mayor":
        return b.precio - a.precio; // de mayor a menor

      case "nombre":
        // Orden alfabético (respeta acentos y ñ)
        return a.nombre.localeCompare(b.nombre, "es", {
          sensitivity: "base",
        });

      case "categoria":
        // Ordena por la primera categoría del data-categoria
        return a.categorias
          .split(/\s+/)[0]
          .localeCompare(b.categorias.split(/\s+/)[0], "es");

      default:
        return productos.indexOf(a) - productos.indexOf(b);
    }
  });

  return (
    <main className="contenedor-principal">
      <h2 className="encabezado-catalogo">CATÁLOGO</h2>

      <div className="barra-busqueda">
        <div className="grupo-campo-busqueda">
          <span className="icono-busqueda">🔍</span>
          <input
            type="text"
            className="campo-busqueda"
            placeholder="Buscar juego, consola o accesorio..."
            value={textoBusqueda}
            onChange={(evento) => setTextoBusqueda(evento.target.value)}
          />
        </div>

        <div className="contenedor-select">
          <select
            className="select-orden"
            value={criterioOrden}
            onChange={(evento) => setCriterioOrden(evento.target.value)}
          >
            <option value="" disabled hidden>
              Ordenar por: Destacados
            </option>
            <option value="precio-menor">Precio: Menor a Mayor</option>
            <option value="precio-mayor">Precio: Mayor a Menor</option>
            <option value="nombre">Nombre: A - Z</option>
            <option value="categoria">Categoria</option>
          </select>
          <span className="flecha-select">▼</span>
        </div>
      </div>

      {/* Filtros de categoría para el Catálogo */}
      <div className="filtros-categoria">
        {/* se les da una categoria */}
        {categoriasPrincipales.map((categoria) => (
          <button
            key={categoria.valor}
            type="button"
            className={`boton-azul ${
              categoriaActiva === categoria.valor ? "" : "boton-borde"
            }`}
            data-categoria={categoria.valor}
            onClick={() => filtrarProductos(categoria.valor)}
          >
            {categoria.texto}
          </button>
        ))}

        {/* Botón de los 3 puntos + menu desplegable */}
        <div className="contenedor-mas-categorias">
          <button
            ref={botonMasRef}
            type="button"
            className="boton-azul boton-borde boton-mas"
            id="btn-mas-categorias"
            title="Más categorías"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            ⋯
          </button>

          <div
            ref={menuRef}
            className={`menu-categorias ${menuAbierto ? "activo" : ""}`}
            id="menu-categorias"
          >
            {categoriasAdicionales.map((categoria) => (
              <button
                key={categoria.valor}
                type="button"
                className="opcion-categoria"
                data-categoria={categoria.valor}
                onClick={() => filtrarProductos(categoria.valor)}
              >
                {categoria.texto}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/*EN CASO DE AGREGAR MAS PRODUCTOS OCUPAR LOS SIGUENTES "data-categoria" O EL FILTRO NO LO DETECTARA

          data-categoria="juegos-de-mesa"
          data-categoria="sillas-gamer"
          data-categoria="mouse"
          data-categoria="mousepad"
          data-categoria="poleras-polerones"
          data-categoria="computadores-gamers"
          data-categoria="accesorios"
          data-categoria="consolas" */}

      <div className="rejilla-productos">
        {productosOrdenados.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>

      {productosOrdenados.length === 0 && (
        <p className="mensaje-sin-resultados">
          No se encontraron productos con esos criterios.
        </p>
      )}
    </main>
  );
}