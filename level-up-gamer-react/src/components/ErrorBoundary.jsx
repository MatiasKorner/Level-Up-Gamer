import { Component } from "react";
import PaginaError from "../pages/PaginaError.jsx";

export default class ErrorBoundary extends Component {
  state = { hayError: false };

  static getDerivedStateFromError() {
    return { hayError: true };
  }

  componentDidCatch(error, info) {
    // Aquí podrías enviar el error a un servicio de registro más adelante
    console.error("Error capturado:", error, info.componentStack);
  }

  // Al navegar a otra ruta, se vuelve a intentar renderizar normalmente
  componentDidUpdate(prevProps) {
    if (this.state.hayError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hayError: false });
    }
  }

  render() {
    if (this.state.hayError) {
      return (
        <PaginaError
          codigo="500"
          subtitulo="ERROR INESPERADO"
          descripcion="Algo falló en el servidor de la matriz. Renace e inténtalo de nuevo."
        />
      );
    }

    return this.props.children;
  }
}