import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../css/auth.css";
import "../css/base.css";
import "../css/componentes.css";

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

const estadoInicial = {
  nombre: "",
  email: "",
  pass1: "",
  pass2: "",
  terminos: false,
  codigoReferido: "",
};

export default function RegistroUsuario() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(estadoInicial);

  // Título de la pestaña, como en el HTML original
  useEffect(() => {
    document.title = "Level-Up Gamer | Crear Cuenta";
  }, []);

  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validarRegistro(evento) {
    evento.preventDefault();

    const nombre = datos.nombre.trim();
    const email = datos.email.trim();
    const codigoReferido = datos.codigoReferido.trim();
    const { pass1, pass2, terminos } = datos;

    if (nombre === "" || nombre.length < 3) {
      alert("Por favor, ingresa tu nombre completo (mínimo 3 caracteres).");
      return;
    }

    const correoValido = DOMINIOS_PERMITIDOS.some((dominio) =>
      email.endsWith(dominio)
    );

    if (!correoValido) {
      alert("Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    if (pass1.length < 4 || pass1.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    if (pass1 !== pass2) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!terminos) {
      alert("Debes aceptar los términos de servicio para continuar.");
      return;
    }

    const usuarioRegistrado = {
      nombre: nombre,
      correo: email,
      contraseña: pass1,
      telefono: "",
      nivel: 1,
      puntos: 0,
      puntosSiguienteNivel: 1000,
      pedidosRealizados: 0,
      codigoReferido: codigoReferido,
    };

    localStorage.setItem(
      "lug_usuario_registrado",
      JSON.stringify(usuarioRegistrado)
    );

    // Alerta personalizada
    Swal.fire({
      title: "¡CUENTA CREADA! 🎮",
      text: "Tu registro se completó exitosamente.",
      icon: "success",
      background: "#121212",
      color: "#ffffff",
      confirmButtonColor: "#1e90ff",
      iconColor: "#39ff14",
      timer: 3000,
      showConfirmButton: false,
    }).then(() => {
      navigate("/login");
    });
  }

  return (
    <>
      <header className="navegacion">
        <Link to="/" className="logotipo">
          LEVEL-<span>UP</span>
        </Link>
      </header>

      <main className="contenedor-principal">
        <div className="contenedor-autenticacion">
          <h1 className="titulo-autenticacion">
            LEVEL-<span>UP</span>
          </h1>
          <p className="subtitulo-autenticacion">CREAR TU CUENTA</p>
          <div className="linea-decorativa"></div>

          <form onSubmit={validarRegistro}>
            <div className="grupo-campo">
              <span className="icono-campo">👤</span>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="campo-entrada"
                placeholder="Nombre completo"
                value={datos.nombre}
                onChange={manejarCambio}
              />
            </div>

            <div className="grupo-campo">
              <span className="icono-campo">✉️</span>
              <input
                type="email"
                id="email"
                name="email"
                className="campo-entrada"
                placeholder="Correo electrónico"
                value={datos.email}
                onChange={manejarCambio}
              />
            </div>

            <div className="grupo-campo">
              <span className="icono-campo">🔒</span>
              <input
                type="password"
                id="pass1"
                name="pass1"
                className="campo-entrada"
                placeholder="Contraseña"
                value={datos.pass1}
                onChange={manejarCambio}
              />
            </div>

            <div className="grupo-campo">
              <span className="icono-campo">🔒</span>
              <input
                type="password"
                id="pass2"
                name="pass2"
                className="campo-entrada"
                placeholder="Confirmar contraseña"
                value={datos.pass2}
                onChange={manejarCambio}
              />
            </div>

            <div className="contenedor-casilla">
              <input
                type="checkbox"
                id="terminos"
                name="terminos"
                checked={datos.terminos}
                onChange={manejarCambio}
              />
              <label htmlFor="terminos" className="texto-casilla">
                Confirmo que tengo <strong>18 años o más</strong> y acepto los{" "}
                <a href="#">Términos de Servicio</a> para acceder a contenido y
                compras de videojuegos.
              </label>
            </div>

            <div className="banner-beneficio-duoc">
              <span className="icono-duoc">🎓</span>
              <div className="texto-duoc">
                <strong>BENEFICIO ESTUDIANTES DUOC UC</strong>
                <br />
                Obtén <strong>20% DE DESCUENTO</strong> en tu primera compra con
                tu credencial estudiantil vigente.
              </div>
            </div>

            <div className="campo-form">
              <label htmlFor="codigo-referido">Código de referido</label>
              <input
                type="text"
                id="codigo-referido"
                name="codigoReferido"
                placeholder="Ingresa un código de referido (opcional)"
                value={datos.codigoReferido}
                onChange={manejarCambio}
              />
            </div>

            <button
              type="submit"
              className="boton-verde"
              style={{ marginBottom: "1.5rem" }}
            >
              CREAR CUENTA →
            </button>

            <p className="pie-autenticacion">
              ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}