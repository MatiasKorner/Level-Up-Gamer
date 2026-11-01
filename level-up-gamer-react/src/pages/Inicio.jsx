// Inicio: página principal con el banner de oferta, los filtros de categoría (FiltroCategorias) y los artículos destacados (TarjetaProducto).
import { useState } from "react";
import FiltroCategorias from "../components/FiltroCategorias.jsx";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

import "../css/base.css";
import "../css/componentes.css";
import "../css/inicio.css";
import "../css/pie.css";

const productos = [
  {
    id: "mando",
    nombre: "Mando Inalámbrico DualSense PS5",
    precio: 64990,
    imagen: "mando.jpg",
    alt: "Mando Inalámbrico DualSense PS5",
    categorias: "consolas tendencias",
  },
  {
    id: "teclado",
    nombre: "Redragon Kumara K552 RGB",
    precio: 32990,
    imagen: "teclado.webp",
    alt: "Redragon Kumara K552 RGB",
    categorias: "pc tendencias",
  },
  {
    id: "mouse",
    nombre: "Mouse Logitech G305",
    precio: 29990,
    imagen: "mouse.webp",
    alt: "Mouse Logitech G305",
    categorias: "pc tendencias",
  },
  {
    id: "auris",
    nombre: "Audífonos Gamer HyperX Cloud II Wireless",
    precio: 89990,
    imagen: "auris.webp",
    alt: "Audífonos Gamer HyperX Cloud II Wireless",
    categorias: "tendencias pc",
  },
  {
    id: "gta",
    nombre: "Grand Theft Auto VI (PS5)",
    precio: 69990,
    imagen: "gta.webp",
    alt: "Grand Theft Auto VI",
    categorias: "consolas tendencias",
  },
];

const categorias = [
  { valor: "tendencias", texto: "Tendencias" },
  { valor: "consolas", texto: "Consolas" },
  { valor: "pc", texto: "PC" },
];

export default function Inicio() {
  const [categoriaActual, setCategoriaActual] = useState("tendencias");

  // Filtra los productos según la categoría seleccionada.
  const productosFiltrados = productos.filter((producto) => {
    const categoriasProducto = producto.categorias.split(/\s+/);
    return categoriasProducto.includes(categoriaActual);
  });

  return (
    <main className="contenedor-principal">
      <div className="banner-principal">
        {/* Imagen de fondo para el banner de oferta */}
        <img
          src="/img/hero-gamer.png"
          alt="Cyber Storm Banner"
          className="imagen-banner-fondo"
        />

        <div className="contenido-banner">
          <span className="etiqueta-banner">OFERTA ESPECIAL</span>
          <h1 className="titulo-banner">CYBER STORM RECARGADO</h1>
          <p className="precio-banner">$29.990 CLP</p>
        </div>
      </div>

      {/* El estado vive aquí; el componente solo muestra y avisa qué se eligió */}
      <FiltroCategorias
        categorias={categorias}
        activa={categoriaActual}
        onSeleccionar={setCategoriaActual}
      />

      <h2 className="titulo-seccion">Artículos Destacados</h2>

      <div className="rejilla-productos">
        {productosFiltrados.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </main>
  );
}