import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BOOTSTRAP_JS =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js";

const estilosPorRuta = {
  "/": [
    "/css/base.css",
    "/css/componentes.css",
    "/css/inicio.css",
    "/css/pie.css",
  ],
  "/catalogo": [
    "/css/base.css",
    "/css/componentes.css",
    "/css/inicio.css",
    "/css/catalogo.css",
    "/css/pie.css",
  ],
  "/detalle": [
    "/css/base.css",
    "/css/componentes.css",
    "/css/inicio.css",
    "/css/detalle.css",
  ],
  "/carrito": [
    "/css/estilos.css",
    "/css/compras.css",
    "/css/base.css",
    "/css/componentes.css",
    "/css/inicio.css",
  ],
  "/pago": ["/css/estilos.css", "/css/compras.css"],
  "/confirmacion": ["/css/estilos.css", "/css/compras.css"],
  "/login": ["/css/estilos.css", "/css/login.css"],
  "/registro": ["/css/base.css", "/css/componentes.css", "/css/auth.css"],
  "/perfil": [
    "/css/estilos.css",
    "/css/cuenta.css",
    "/css/base.css",
    "/css/componentes.css",
    "/css/inicio.css",
  ],
  "/pedidos": ["/css/estilos.css", "/css/cuenta.css"],
  "/puntos": ["/css/estilos.css", "/css/cuenta.css"],
  "/blog": [
    "/css/base.css",
    "/css/componentes.css",
    "/css/blog.css",
    "/css/inicio.css",
  ],
  "/articulo": ["/css/articulo.css"],
  "/soporte": [
    "/css/support.css",
    "/css/base.css",
    "/css/componentes.css",
    "/css/inicio.css",
  ],
  "/admin": ["/css/base.css", "/css/admin.css"],
  "/404": ["/css/error.css"],
};

const estilosPreparados = new Map();

function prepararEstilo(href) {
  if (estilosPreparados.has(href)) {
    return estilosPreparados.get(href);
  }

  const promesa = new Promise((resolve) => {
    const existente = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]'),
    ).find((link) => link.getAttribute("href") === href);

    if (existente) {
      if (existente.sheet) {
        resolve();
        return;
      }

      existente.addEventListener("load", () => resolve(), { once: true });
      existente.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.lugPageStyle = "true";

    link.onload = () => resolve();
    link.onerror = () => resolve();

    document.head.appendChild(link);
  });

  estilosPreparados.set(href, promesa);
  return promesa;
}

export default function PageStyles() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelado = false;

    async function cargarEstilos() {
      const archivos = estilosPorRuta[pathname] ?? estilosPorRuta["/404"];

      await Promise.all(archivos.map(prepararEstilo));

      if (cancelado) return;

      document.querySelectorAll("link[data-lug-page-style]").forEach((link) => {
        link.disabled = false;
      });

      // Carga Bootstrap JS una sola vez.
      if (!document.querySelector("script[data-lug-bootstrap]")) {
        const script = document.createElement("script");
        script.src = BOOTSTRAP_JS;
        script.dataset.lugBootstrap = "true";
        document.body.appendChild(script);
      }
    }

    cargarEstilos();

    return () => {
      cancelado = true;
    };
  }, [pathname]);

  return null;
}
