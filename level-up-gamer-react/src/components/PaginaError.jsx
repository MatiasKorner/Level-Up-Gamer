import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../css/error.css";

export default function PaginaError({ codigo = "404", subtitulo = "...", descripcion = "..." }) {
  // 1. Referencias y estado
  const formRef = useRef(null);
  const modalReporteRef = useRef(null);
  const cerrarReporteRef = useRef(null);
  const abrirExitoRef = useRef(null);
  const [validado, setValidado] = useState(false);

  // 2. Efecto de limpieza del modal
  useEffect(() => {
    return () => {
      // ...
    };
  }, []);

  // 3. AQUÍ va enviarReporte
  function enviarReporte(evento) {
    evento.preventDefault();
    // ...la versión actualizada con trim()
  }

  // 4. El JSX
  return (
    <>
      {/* ... */}
    </>
  );
}