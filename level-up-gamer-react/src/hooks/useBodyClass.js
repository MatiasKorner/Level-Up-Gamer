import { useEffect } from "react";

// Agrega una clase al <body> mientras el componente está montado
export default function useBodyClass(clase) {
  useEffect(() => {
    document.body.classList.add(clase);
    return () => document.body.classList.remove(clase);
  }, [clase]);
}