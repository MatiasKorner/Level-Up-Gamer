import { useState } from "react";
import { Link } from "react-router-dom";
import articulosBlog from "../data/articulosBlog.js";
import useBodyClass from "../hooks/useBodyClass.js";

import "../css/blog.css";

const categorias = ["Todo", "Reseñas", "Hardware", "Consejos", "Esports"];

export default function Blog() {
  useBodyClass("blog-page");

  const [categoriaActual, setCategoriaActual] = useState("Todo");

  const articuloDestacado = articulosBlog.find((a) => a.destacado);
  const articulos = articulosBlog.filter((a) => !a.destacado);

  const articulosFiltrados = articulos.filter(
    (a) => categoriaActual === "Todo" || a.categoria === categoriaActual
  );

  // El destacado solo se muestra en "Todo" o en su propia categoría
  const mostrarDestacado =
    articuloDestacado &&
    (categoriaActual === "Todo" ||
      categoriaActual === articuloDestacado.categoria);

  return (
    <main className="container py-4">
      {/* Rejilla de Bootstrap: todo el ancho en móvil, centrado y más angosto en pantallas grandes */}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-9">
          <h1 className="blog-title mb-4">BLOG GAMER</h1>

          <div className="category-filters d-flex flex-wrap gap-2 mb-4">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                className={`category-btn ${
                  categoriaActual === categoria ? "active" : ""
                }`}
                onClick={() => setCategoriaActual(categoria)}
                aria-pressed={categoriaActual === categoria}
              >
                {categoria}
              </button>
            ))}
          </div>

          {mostrarDestacado && (
            <article className="featured-post mb-4">
              <Link
                to={`/articuloN1?id=${encodeURIComponent(articuloDestacado.id)}`}
                className="featured-link"
              >
                <div className="featured-image-wrapper">
                  <img
                    src={`/img/${articuloDestacado.imagen}`}
                    alt={articuloDestacado.alt}
                    className="featured-image"
                  />
                  <span className="featured-badge">DESTACADO</span>
                </div>

                <div className="featured-content">
                  <h2 className="featured-title">
                    {articuloDestacado.tituloCard ?? articuloDestacado.titulo}
                  </h2>
                  <div className="featured-meta">
                    <span className="post-category">
                      {articuloDestacado.categoria.toUpperCase()}
                    </span>
                    <span className="post-time">
                      {articuloDestacado.tiempo}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Lista de posts: una columna en móvil y dos desde tablet (md) */}
          <div className="row g-3">
            {articulosFiltrados.map((articulo) => (
              <div className="col-12 col-md-6" key={articulo.id}>
                <Link
                  to={`/articuloN1?id=${encodeURIComponent(articulo.id)}`}
                  className="post-card h-100"
                >
                  <img
                    src={`/img/${articulo.imagen}`}
                    alt={articulo.alt}
                    className="post-card-image"
                  />
                  <div className="post-card-content">
                    <h3 className="post-card-title">
                      {articulo.tituloCard ?? articulo.titulo}
                    </h3>
                    <div className="post-card-meta">
                      <span className="post-card-category">
                        {articulo.categoria.toUpperCase()}
                      </span>
                      <span className="post-card-time">{articulo.tiempo}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}