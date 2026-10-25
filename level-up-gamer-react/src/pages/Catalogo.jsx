import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

import "../css/base.css";
import "../css/componentes.css";
import "../css/inicio.css";
import "../css/catalogo.css";
import "../css/pie.css";

const productos = [
  {
    id: "mando",
    nombre: "Mando DualSense PS5",
    precio: 64990,
    imagen: "mando.jpg",
    alt: "Mando DualSense PS5",
    categorias: "consolas tendencias accesorios",
  },
  {
    id: "auris",
    nombre: "Audífonos HyperX Cloud II",
    precio: 89990,
    imagen: "auris.webp",
    alt: "Audífonos HyperX Cloud II",
    categorias: "accesorios tendencias",
  },
  {
    id: "teclado",
    nombre: "Teclado Redragon Kumara",
    precio: 32990,
    imagen: "teclado.webp",
    alt: "Teclado Redragon Kumara",
    categorias: "accesorios tendencias",
  },
  {
    id: "mouse",
    nombre: "Mouse Logitech G305",
    precio: 29990,
    imagen: "mouse.webp",
    alt: "Mouse Logitech G305",
    categorias: "mouse tendencias",
  },
  {
    id: "gta",
    nombre: "Grand Theft Auto VI (PS5)",
    precio: 69990,
    imagen: "gta.webp",
    alt: "Grand Theft Auto VI para PS5",
    categorias: "consolas tendencias",
  },
  {
    id: "ea-fc",
    nombre: "EA Sports FC 26",
    precio: 54990,
    imagen: "fc.jpg",
    alt: "EA Sports FC 26",
    categorias: "consolas",
  },
  {
    id: "mousepad",
    nombre: "Mousepad Monster Games USB RGB Negro",
    precio: 9990,
    imagen: "mousepad.jpg",
    alt: "Mousepad Monster Games USB RGB Negro",
    categorias: "mousepad accesorios",
  },
  {
    id: "ps5",
    nombre: "Consola PlayStation 5",
    precio: 549990,
    imagen: "play.avif",
    alt: "Consola PlayStation 5",
    categorias: "consolas",
  },
  {
    id: "mandoxbox",
    nombre: "Mando Inalámbrico Xbox Wireless Controller Robot White",
    precio: 69990,
    imagen: "mandoxbox.avif",
    alt: "Mando inalámbrico Xbox Robot White",
    categorias: "consolas accesorios",
  },
  {
    id: "gabinetegamer",
    nombre: "Gabinete Gamer Mid-Tower RGB Vidrio Templado",
    precio: 45990,
    imagen: "gabinete.webp",
    alt: "Gabinete Gamer Mid-Tower RGB",
    categorias: "computadores-gamers",
  },
  {
    id: "pcGamerVibora",
    nombre: "Pc Gamer Vibora Black V2 AMD Ryzen 5 5600GT",
    precio: 589990,
    imagen: "pc.webp",
    alt: "PC Gamer Vibora Black V2",
    categorias: "computadores-gamers",
  },
  {
    id: "notebookAsus",
    nombre: "Notebook Asus Intel Core i5 12GB SSD Azul Marino",
    precio: 499990,
    imagen: "note.png",
    alt: "Notebook Asus Intel Core i5",
    categorias: "computadores-gamers",
  },
  {
    id: "monitorGamer",
    nombre: 'Monitor Gamer 24" FHD 165Hz 1ms IPS',
    precio: 119990,
    imagen: "monitor.jpg",
    alt: "Monitor Gamer 24 pulgadas",
    categorias: "computadores-gamers",
  },
];

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

function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-CL")} CLP`;
}

export default function Catalogo() {
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
    // Obtenemos las categorías de la tarjeta
    // Ejemplo: "consolas tendencias" → ["consolas", "tendencias"]
    const cats = producto.categorias.toLowerCase().split(/\s+/);

    // Obtenemos el título del producto
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

  // PASO 2: Ordenar las tarjetas filtradas
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
          <div
            className="tarjeta"
            key={producto.id}
            data-categoria={producto.categorias}
          >
            <img
              src={`/img/${producto.imagen}`}
              alt={producto.alt}
              className="imagen-tarjeta"
            />

            <div className="titulo-tarjeta">{producto.nombre}</div>

            <div className="precio-tarjeta">
              {formatearPrecio(producto.precio)}
            </div>

            <Link
              to={`/detalle?id=${encodeURIComponent(producto.id)}`}
              className="boton-azul"
            >
              Ver Detalle
            </Link>
          </div>
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
