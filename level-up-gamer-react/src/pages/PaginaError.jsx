import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../css/error.css";

export default function PaginaError({
  codigo = "404",
  subtitulo = "PÁGINA NO ENCONTRADA",
  descripcion = "Este nivel no existe, Jugador. La URL que ingresaste fue borrada de la matriz del servidor. Renace e inténtalo de nuevo.",
}) {
  const formRef = useRef(null);
  const modalReporteRef = useRef(null);
  const cerrarReporteRef = useRef(null);
  const abrirExitoRef = useRef(null);
  const [validado, setValidado] = useState(false);

  // Si el usuario sale de la página con un modal abierto, limpia el fondo oscuro
  useEffect(() => {
    return () => {
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
    };
  }, []);

  function enviarReporte(evento) {
    evento.preventDefault();
    const formulario = formRef.current;

    if (!formulario.checkValidity()) {
      setValidado(true);
      return;
    }

    // Aquí iría el envío real (new FormData(formulario)) cuando exista backend.

    // Cierra el modal de reporte y, cuando termine de cerrarse, abre el de éxito
    modalReporteRef.current.addEventListener(
      "hidden.bs.modal",
      () => abrirExitoRef.current.click(),
      { once: true }
    );
    cerrarReporteRef.current.click();

    formulario.reset();
    setValidado(false);
  }

  return (
    <>
      <main className="error-page d-flex flex-column justify-content-center align-items-center">
        <h1 className="error-code">{codigo}</h1>
        <span className="error-skull">💀</span>
        <span className="error-title">JUEGO TERMINADO</span>
        <p className="error-subtitle">{subtitulo}</p>
        <p className="error-description">{descripcion}</p>

        <img
          src="/img/error-decoration.png"
          alt=""
          className="error-decoration"
        />

        <div className="error-actions">
          <Link to="/" className="error-button error-button-first">
            ↩ RENACER – IR AL INICIO
          </Link>

          {/* data-bs-toggle y data-bs-target le indican a Bootstrap qué modal abrir */}
          <a
            href="#"
            className="error-button error-button-second"
            data-bs-toggle="modal"
            data-bs-target="#reportModal"
          >
            📞REPORTAR ESTE ERROR
          </a>
        </div>
      </main>

      {/* Modal de reporte */}
      <div
        className="modal fade"
        id="reportModal"
        tabIndex="-1"
        aria-labelledby="reportModalLabel"
        aria-hidden="true"
        ref={modalReporteRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white border-primary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title" id="reportModalLabel">
                Reportar Error
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
                ref={cerrarReporteRef}
              ></button>
            </div>

            <div className="modal-body">
              <form
                ref={formRef}
                id="reportForm"
                className={`needs-validation ${validado ? "was-validated" : ""}`}
                noValidate
                onSubmit={enviarReporte}
              >
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    id="username"
                    name="username"
                    required
                    minLength={4}
                  />
                  <div className="invalid-feedback">
                    Escribe un nombre de usuario válido (mínimo 4 caracteres).
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Título del reporte
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    id="title"
                    name="title"
                    required
                    minLength={5}
                  />
                  <div className="invalid-feedback">
                    El título debe tener al menos 5 caracteres.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción del error
                  </label>
                  <textarea
                    className="form-control bg-dark text-white border-secondary"
                    id="description"
                    name="description"
                    rows="4"
                    required
                    minLength={10}
                  ></textarea>
                  <div className="invalid-feedback">
                    Describe el error con al menos 10 caracteres.
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Enviar reporte
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Botón invisible que abre el modal de éxito desde el código */}
      <button
        type="button"
        hidden
        data-bs-toggle="modal"
        data-bs-target="#successModal"
        ref={abrirExitoRef}
      ></button>

      {/* Modal de éxito */}
      <div
        className="modal fade"
        id="successModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white border-success">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">Reporte enviado</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body text-center">
              <div className="mb-3" style={{ fontSize: "3rem" }}>
                <img src="/img/modal-sent.png" alt="" className="img-modal" />
              </div>
              <p className="mb-0">¡Tu reporte se envió correctamente!</p>
              <p className="text-secondary small">
                Gracias por ayudarnos a mejorar.
              </p>
            </div>
            <div className="modal-footer border-secondary justify-content-center">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}