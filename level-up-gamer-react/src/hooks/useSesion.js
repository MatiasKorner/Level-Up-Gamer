import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const hayUsuario = () => Boolean(localStorage.getItem("lug_user"));

// Devuelve true si hay una sesión iniciada
export default function useSesion() {
  const { pathname } = useLocation();
  const [haySesion, setHaySesion] = useState(hayUsuario);

  // Se revisa en cada cambio de página
  useEffect(() => {
    setHaySesion(hayUsuario());
  }, [pathname]);

  // Y cuando otra pestaña, o el propio código, avisa de un cambio
  useEffect(() => {
    const actualizar = () => setHaySesion(hayUsuario());
    window.addEventListener("storage", actualizar);
    window.addEventListener("lug-sesion-actualizada", actualizar);
    return () => {
      window.removeEventListener("storage", actualizar);
      window.removeEventListener("lug-sesion-actualizada", actualizar);
    };
  }, []);

  return haySesion;
}