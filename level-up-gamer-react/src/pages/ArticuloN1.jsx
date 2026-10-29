import { Link, useSearchParams } from "react-router-dom";
import articulosBlog from "../data/articulosBlog.js";
import useBodyClass from "../hooks/useBodyClass.js";
import "../css/articulo.css";

// Misma columna para toda la página, para que imagen, cabecera y texto queden alineados
const COLUMNA = "col-12 col-lg-10 col-xl-9";

export default function ArticuloN1() {
  useBodyClass("article-page");

  const [searchParams] = useSearchParams();
  const idArticulo = searchParams.get("id");
  const articulo = articulosBlog.find((item) => item.id === idArticulo);

  // Si el ID no existe, ofrecemos volver al blog
  if (!articulo) {
    return (
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className={COLUMNA}>
            <h1 className="article-title">Artículo no encontrado</h1>
            <p className="article-intro mt-3">
              El artículo que buscas no existe o el enlace no es válido.
            </p>
            <Link to="/blog" className="back-button mt-4">
              <span className="back-arrow">←</span> VOLVER AL BLOG
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-3">
      <div className="row justify-content-center">
        <div className={COLUMNA}>
          <div className="article-header d-flex align-items-center justify-content-between mb-3">
            <Link to="/blog" className="back-button">
              <span className="back-arrow">←</span> ARTICULO
            </Link>
          </div>

          {/* Imagen principal: dentro de la columna, con esquinas redondeadas */}
          <div className="ratio ratio-21x9 rounded overflow-hidden mb-4">
            <img
              src={`/img/${articulo.imagen}`}
              alt={articulo.alt}
              className="object-fit-cover"
            />
          </div>

          <article className="pb-5">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge-custom badge-reviews">
                {articulo.categoria.toUpperCase()}
              </span>

              {articulo.etiquetas.map((etiqueta) => (
                <span className="badge-custom badge-top10" key={etiqueta}>
                  {etiqueta}
                </span>
              ))}
            </div>

            <h1 className="article-title mb-3">{articulo.titulo}</h1>

            <div className="author-meta d-flex align-items-center gap-2 mb-4">
              <img
                src={`/img/${articulo.imagenAutor}`}
                alt={articulo.autor}
                className="author-avatar"
              />

              <div>
                <div className="author-name">{articulo.autor}</div>
                <div className="article-meta">
                  {articulo.fecha} - {articulo.lectura}
                </div>
              </div>
            </div>

            <p className="article-intro mb-4">{articulo.introduccion}</p>

            {articulo.cita && (
              <blockquote className="article-quote mb-5">
                “{articulo.cita}”
              </blockquote>
            )}

            {articulo.secciones.map((seccion, indice) => (
              <section className="game-entry mb-5" key={indice}>
                <h2 className="game-number">{seccion.titulo}</h2>
                <p className="game-description">{seccion.texto}</p>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}