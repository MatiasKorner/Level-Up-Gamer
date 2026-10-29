import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Sube al inicio de la página cada vez que cambia la ruta o el ?id= del artículo
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);

  return null;
}