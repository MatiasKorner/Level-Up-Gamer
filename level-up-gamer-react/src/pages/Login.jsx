import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass.js";
import "../css/estilos.css";
import "../css/login.css";

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

const USUARIOS_ADMIN = [
  { correo: "admin@levelup.cl", contraseña: "admin123", rol: "Administrador" },
  { correo: "vendedor@levelup.cl", contraseña: "vende123", rol: "Vendedor" },
];

const MSG_CORREO = "Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";
const MSG_CORREO_ADMIN = "Ingresa un correo administrativo @levelup.cl";
const MSG_CONTRASENA = "La contraseña debe tener entre 4 y 10 caracteres";
const MSG_CREDENCIALES = "Correo o contraseña incorrectos";

// Validación de correo electrónico
function validarCorreo(correo) {
  return DOMINIOS_PERMITIDOS.some((dominio) => correo.endsWith(dominio));
}

function validarContraseña(contraseña) {
  return contraseña.length >= 4 && contraseña.length <= 10;
}

function leerUsuarioRegistrado() {
  try {
    return JSON.parse(localStorage.getItem("lug_usuario_registrado"));
  } catch {
    return null;
  }
}

export default function Login() {
  useBodyClass("login-page");
  const navigate = useNavigate();

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = "Level-Up Gamer - Inicio de Sesión";
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  // Alterna entre el acceso de cliente y el de administración
  const [modoAdmin, setModoAdmin] = useState(false);

  // Formulario de cliente
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");

  // Formulario de administración
  const [correoAdmin, setCorreoAdmin] = useState("");
  const [contrasenaAdmin, setContrasenaAdmin] = useState("");
  const [errorCorreoAdmin, setErrorCorreoAdmin] = useState("");
  const [errorContrasenaAdmin, setErrorContrasenaAdmin] = useState("");

  // ----- Validación en tiempo real (solo actualiza lo visual) -----

  function cambiarCorreo(evento) {
    const valor = evento.target.value;
    setCorreo(valor);
    const limpio = valor.trim();
    setErrorCorreo(
      limpio.includes("@") && !validarCorreo(limpio) ? MSG_CORREO : ""
    );
  }

  function cambiarContrasena(evento) {
    const valor = evento.target.value;
    setContrasena(valor);
    setErrorContrasena(
      valor !== "" && !validarContraseña(valor) ? MSG_CONTRASENA : ""
    );
  }

  function cambiarCorreoAdmin(evento) {
    const valor = evento.target.value;
    setCorreoAdmin(valor);
    const limpio = valor.trim();
    setErrorCorreoAdmin(
      limpio.includes("@") && !limpio.endsWith("@levelup.cl")
        ? MSG_CORREO_ADMIN
        : ""
    );
  }

  function cambiarContrasenaAdmin(evento) {
    const valor = evento.target.value;
    setContrasenaAdmin(valor);
    setErrorContrasenaAdmin(
      valor !== "" && !validarContraseña(valor) ? MSG_CONTRASENA : ""
    );
  }

  // ----- Envío del formulario de cliente -----

  function iniciarSesion(evento) {
    evento.preventDefault();

    const correoLimpio = correo.trim();

    if (!validarCorreo(correoLimpio)) {
      setErrorCorreo(MSG_CORREO);
      return;
    }
    setErrorCorreo("");

    const contrasenaLimpia = contrasena.trim();

    if (!validarContraseña(contrasenaLimpia)) {
      setErrorContrasena(MSG_CONTRASENA);
      return;
    }
    setErrorContrasena("");

    const usuarioRegistrado = leerUsuarioRegistrado();

    if (
      !usuarioRegistrado ||
      usuarioRegistrado.correo !== correoLimpio ||
      usuarioRegistrado.contraseña !== contrasenaLimpia
    ) {
      setErrorContrasena(MSG_CREDENCIALES);
      return;
    }

    const usuarioSesion = {
      nombre: usuarioRegistrado.nombre,
      correo: usuarioRegistrado.correo,
      telefono: usuarioRegistrado.telefono,
      nivel: usuarioRegistrado.nivel,
      puntos: usuarioRegistrado.puntos,
      puntosSiguienteNivel: usuarioRegistrado.puntosSiguienteNivel,
      pedidosRealizados: usuarioRegistrado.pedidosRealizados,
    };

    localStorage.setItem("lug_correo", correoLimpio);
    localStorage.setItem("lug_user", JSON.stringify(usuarioSesion));
    window.dispatchEvent(new Event("lug-sesion-actualizada"));

    navigate("/");
  }

  // ----- Envío del formulario de administración -----

  function iniciarSesionAdmin(evento) {
    evento.preventDefault();

    const correoLimpio = correoAdmin.trim();

    if (!correoLimpio.endsWith("@levelup.cl")) {
      setErrorCorreoAdmin(MSG_CORREO_ADMIN);
      return;
    }
    setErrorCorreoAdmin("");

    const contrasenaLimpia = contrasenaAdmin.trim();

    if (!validarContraseña(contrasenaLimpia)) {
      setErrorContrasenaAdmin(MSG_CONTRASENA);
      return;
    }
    setErrorContrasenaAdmin("");

    const usuarioEncontrado = USUARIOS_ADMIN.find(
      (usuario) =>
        usuario.correo === correoLimpio &&
        usuario.contraseña === contrasenaLimpia
    );

    if (!usuarioEncontrado) {
      setErrorContrasenaAdmin(MSG_CREDENCIALES);
      return;
    }

    localStorage.setItem("lug_correo", usuarioEncontrado.correo);
    localStorage.setItem("lug_rol", usuarioEncontrado.rol);

    alert("Bienvenido " + usuarioEncontrado.rol);
    navigate("/admin");

    // Más adelante aquí validaremos el rol y el acceso administrativo.
  }

  // Entrar a la tienda sin iniciar sesión
  function entrarComoInvitado() {
    localStorage.removeItem("lug_user");
    localStorage.removeItem("lug_correo");
    localStorage.removeItem("lug_rol");
  }

  return (
    <div className="pagina-login">
      <img
        src="/img/logo-Level-Up.png"
        alt="Logo Level-Up Gamer"
        className="logo-principal"
      />

      <div className={`login-contenedor ${modoAdmin ? "admin-activo" : ""}`}>
        {/* Panel de acceso cliente */}
        <section className="panel-cliente">
          <main className="container px-3 pb-5 pt-4">
            {/* Encabezado / título */}
            <section className="text-center mb-4">
              <h1 className="titulo-marca">
                LEVEL-<span>UP</span>
              </h1>
              <p className="subtitulo-marca">TIENDA GAMER</p>
              <p className="texto-bienvenida mt-3">
                Bienvenida de nuevo, Jugador Uno 👾
              </p>
            </section>

            {/* Banner estudiantes Duoc UC */}
            <div className="banner-estudiante d-flex align-items-center gap-2 mb-4 p-2 rounded">
              <span className="icono-estudiante">🎓</span>
              <p className="texto-banner mb-0">
                <strong>DUOC UC</strong> — Ingresa con tu correo estudiantil y
                obtén <strong>20% DE DESCUENTO.</strong>
              </p>
            </div>

            {/* Formulario de entrada */}
            <form
              id="form-login"
              className="formulario-login mb-3"
              onSubmit={iniciarSesion}
            >
              {/* Campo correo */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-dark text-secondary border-secondary">
                  ✉
                </span>
                <input
                  type="email"
                  id="correo"
                  className={`form-control bg-dark text-white border-secondary ${
                    errorCorreo ? "is-invalid" : ""
                  }`}
                  placeholder="Correo electrónico"
                  maxLength={100}
                  required
                  value={correo}
                  onChange={cambiarCorreo}
                />
              </div>

              <small id="error-correo" className="text-danger">
                {errorCorreo}
              </small>

              {/* Campo contraseña */}
              <div className="input-group mb-2">
                <span className="input-group-text bg-dark text-secondary border-secondary">
                  🔒
                </span>
                <input
                  type="password"
                  id="contraseña"
                  className={`form-control bg-dark text-white border-secondary ${
                    errorContrasena ? "is-invalid" : ""
                  }`}
                  placeholder="Contraseña"
                  maxLength={10}
                  required
                  value={contrasena}
                  onChange={cambiarContrasena}
                />
              </div>

              <small id="error-contraseña" className="text-danger">
                {errorContrasena}
              </small>

              {/* Enlace olvidaste contraseña */}
              <div className="text-end mb-4">
                <a href="#" className="enlace-olvido small">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón iniciar sesión */}
              <button
                type="submit"
                className="btn boton-ingresar w-100 fw-bold text-uppercase py-2 mb-4"
              >
                INICIAR SESIÓN →
              </button>

              {/* Entrar a la tienda sin iniciar sesión */}
              <Link
                to="/"
                className="invitado-link"
                id="btn-invitado"
                onClick={entrarComoInvitado}
              >
                ENTRAR COMO INVITADO
              </Link>
            </form>

            {/* Divisor */}
            <div className="text-center position-relative mb-4">
              <hr className="border-secondary opacity-25" />
              <span className="position-absolute top-50 start-50 translate-middle px-2 bg-black text-secondary small">
                o ingresa con
              </span>
            </div>

            {/* Botones de redes sociales */}
            <div className="row g-2 mb-4">
              <div className="col-4">
                <button
                  type="button"
                  className="btn boton-red-social w-100 d-flex flex-column align-items-center py-2 text-white"
                >
                  <span>🎮</span>
                  <small className="text-secondary">Steam</small>
                </button>
              </div>
              <div className="col-4">
                <button
                  type="button"
                  className="btn boton-red-social w-100 d-flex flex-column align-items-center py-2 text-white"
                >
                  <span>💬</span>
                  <small className="text-secondary">Discord</small>
                </button>
              </div>
              <div className="col-4">
                <button
                  type="button"
                  className="btn boton-red-social w-100 d-flex flex-column align-items-center py-2 text-white"
                >
                  <span>🌐</span>
                  <small className="text-secondary">Google</small>
                </button>
              </div>
            </div>

            {/* Enlace a registro */}
            <div className="text-center mt-2">
              <span className="text-secondary small">¿Nuevo aquí?</span>
              <Link
                to="/registro"
                className="enlace-registro fw-bold small ms-1"
              >
                Crear Cuenta →
              </Link>
            </div>
          </main>
        </section>

        {/* Panel de acceso a administración */}
        <section className="panel-admin-info">
          <div className="contenido-admin">
            <div className="encabezado-admin">
              <span className="icono-admin">🛡️</span>
              <h2>ADMINISTRACIÓN</h2>
            </div>

            <div className="banner-admin">
              <span className="icono-equipo">👥</span>
              <p>
                Acceso exclusivo para el equipo <strong>Level-Up.</strong>
              </p>
            </div>

            <button
              type="button"
              id="btn-admin"
              className="btn boton-admin"
              onClick={() => setModoAdmin(true)}
            >
              ACCESO ADMIN
            </button>
          </div>

          <div className="contenido-cliente">
            <div className="encabezado-cliente">
              <span className="icono-admin">🎮</span>
              <h2>CUENTA LEVEL-UP</h2>
            </div>

            <div className="banner-cliente">
              <span className="icono-equipo">👤</span>
              <p>
                Regresa al acceso principal de <strong>Level-Up.</strong>
              </p>
            </div>

            <button
              type="button"
              id="btn-cliente"
              className="btn boton-cliente"
              onClick={() => setModoAdmin(false)}
            >
              CUENTA LEVEL-UP
            </button>
          </div>
        </section>

        {/* Formulario de acceso administrador */}
        <section className="panel-admin-form">
          <main className="container px-3 pb-5 pt-4">
            <section className="text-center mb-4 encabezado-form-admin">
              <h1 className="titulo-marca">
                LEVEL-<span>UP</span>
              </h1>
              <p className="subtitulo-marca">ADMINISTRACIÓN</p>
              <p className="texto-bienvenida mt-3">
                Acceso al sistema administrativo
              </p>
            </section>

            <form id="form-admin" onSubmit={iniciarSesionAdmin}>
              <div className="input-group mb-2">
                <span className="input-group-text bg-dark text-secondary border-secondary">
                  ✉
                </span>
                <input
                  type="email"
                  id="correo-admin"
                  className={`form-control bg-dark text-white border-secondary ${
                    errorCorreoAdmin ? "is-invalid" : ""
                  }`}
                  placeholder="Correo administrativo"
                  maxLength={100}
                  required
                  value={correoAdmin}
                  onChange={cambiarCorreoAdmin}
                />
              </div>

              <small id="error-correo-admin" className="text-danger">
                {errorCorreoAdmin}
              </small>

              <div className="input-group mb-3">
                <span className="input-group-text bg-dark text-secondary border-secondary">
                  🔒
                </span>
                <input
                  type="password"
                  id="contraseña-admin"
                  className={`form-control bg-dark text-white border-secondary ${
                    errorContrasenaAdmin ? "is-invalid" : ""
                  }`}
                  placeholder="Contraseña"
                  maxLength={10}
                  required
                  value={contrasenaAdmin}
                  onChange={cambiarContrasenaAdmin}
                />
              </div>

              <small id="error-contraseña-admin" className="text-danger">
                {errorContrasenaAdmin}
              </small>

              <button type="submit" className="btn boton-ingresar w-100 fw-bold">
                INGRESAR AL SISTEMA
              </button>
            </form>
          </main>
        </section>
      </div>
    </div>
  );
}