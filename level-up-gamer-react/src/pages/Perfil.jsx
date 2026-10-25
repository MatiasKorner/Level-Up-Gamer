import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LevelUp from "../services/tienda.js";
import "../css/estilos.css";
import "../css/cuenta.css";
import "../css/inicio.css";

const CAMPOS = [
  { name: "nombre", id: "editar-nombre", label: "Nombre de usuario", type: "text" },
  { name: "correo", id: "editar-correo", label: "Correo electrónico", type: "email" },
  { name: "telefono", id: "editar-telefono", label: "Teléfono", type: "tel", placeholder: "+56 9 xxxx xxxx" },
];

const OPCIONES_PROXIMAMENTE = [
  { icono: "💳", titulo: "Métodos de Pago", detalle: "2 tarjetas guardadas" },
  { icono: "📍", titulo: "Mis Direcciones", detalle: "Santiago, Región Metropolitana" },
  { icono: "🔔", titulo: "Notificaciones", detalle: "Push y correo activados" },
  { icono: "🛡", titulo: "Seguridad", detalle: "Verificación en 2 pasos activada" },
];

// Mismas reglas y mensajes que el perfil.js original (usa LevelUp.Validar)
function validarCampos(valores) {
  const { Validar } = LevelUp;

  const reglas = {
    nombre: [
      { test: Validar.requerido, mensaje: "Ingresa tu nombre de usuario." },
      { test: Validar.minLargo(3), mensaje: "Debe tener al menos 3 caracteres." },
    ],
    correo: [
      { test: Validar.requerido, mensaje: "Ingresa tu correo." },
      { test: Validar.email, mensaje: "Correo electrónico no válido." },
    ],
    telefono: [
      { test: Validar.requerido, mensaje: "Ingresa tu teléfono." },
      { test: Validar.telefonoCL, mensaje: "Formato esperado: +56 9 xxxx xxxx." },
    ],
  };

  const errores = {};
  for (const [campo, pruebas] of Object.entries(reglas)) {
    const fallo = pruebas.find((p) => !p.test(valores[campo]));
    if (fallo) errores[campo] = fallo.mensaje;
  }
  return errores;
}

export default function Perfil() {
  // Como el original: sin sesión, no se llama a Usuario.obtener()
  // (esa función crea un usuario de ejemplo si no hay ninguno)
  const [usuario, setUsuario] = useState(() =>
    localStorage.getItem("lug_user") ? LevelUp.Usuario.obtener() : null
  );
  const [formulario, setFormulario] = useState(() => ({
    nombre: usuario?.nombre ?? "",
    correo: usuario?.correo ?? "",
    telefono: usuario?.telefono ?? "",
  }));
  const [errores, setErrores] = useState({});
  const [intentado, setIntentado] = useState(false);
  const cerrarModalRef = useRef(null);

  // Si el usuario sale con el modal abierto, limpia el fondo oscuro
  useEffect(() => {
    return () => {
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
    };
  }, []);

  // Sin sesión iniciada: al login
  if (!usuario) return <Navigate to="/login" replace />;

  const puntos = usuario.puntos.toLocaleString("es-CL");

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  // is-invalid / is-valid, igual que Validar.marcarInvalido / marcarValido
  function claseCampo(nombre) {
    if (errores[nombre]) return "is-invalid";
    return intentado ? "is-valid" : "";
  }

  function guardarCambios(evento) {
    evento.preventDefault();

    const nuevosErrores = validarCampos(formulario);
    setErrores(nuevosErrores);
    setIntentado(true);

    const primerInvalido = CAMPOS.find((c) => nuevosErrores[c.name]);
    if (primerInvalido) {
      document.getElementById(primerInvalido.id)?.focus();
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
      telefono: formulario.telefono.trim(),
    };

    const actualizado = LevelUp.Usuario.actualizar(datos);

    // Mantiene sincronizado el usuario registrado (lo lee el login)
    try {
      const registrado = JSON.parse(
        localStorage.getItem("lug_usuario_registrado")
      );
      if (registrado) {
        localStorage.setItem(
          "lug_usuario_registrado",
          JSON.stringify({ ...registrado, ...datos })
        );
      }
    } catch {
      /* si el JSON está dañado, no se toca */
    }

    cerrarModalRef.current.click();
    LevelUp.toast("Perfil actualizado correctamente");

    setUsuario(actualizado);
    setFormulario(datos);
    setErrores({});
    setIntentado(false);
  }

  function cerrarSesion() {
    if (confirm("¿Cerrar sesión?")) {
      localStorage.removeItem("lug_correo");
      localStorage.removeItem("lug_rol");
      localStorage.removeItem("lug_user");
      window.location.href = "/login";
    }
  }

  return (
    <>
      <div className="app-shell">
        <main className="container px-3 pb-5 pt-4">
          <div className="perfil-header">
            <h1 className="page-title">Mi Perfil</h1>
            <button
              type="button"
              className="enlace-editar"
              data-bs-toggle="modal"
              data-bs-target="#modal-editar-perfil"
            >
              Editar ✏
            </button>
          </div>

          <div className="perfil-datos">
            <div className="avatar-circle">🎮</div>
            <div>
              <h2 id="perfil-nombre">{usuario.nombre}</h2>
              <p className="correo" id="perfil-correo">
                {usuario.correo}
              </p>
              <span className="badge-nivel" id="perfil-badge-nivel">
                Gamer Pro Niv. {usuario.nivel}
              </span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <strong id="stat-nivel">{usuario.nivel}</strong>
              <span>Nivel</span>
            </div>
            <div className="stat-box">
              <strong id="stat-puntos">{puntos}</strong>
              <span>Puntos</span>
            </div>
            <div className="stat-box">
              <strong id="stat-pedidos">{usuario.pedidosRealizados}</strong>
              <span>Pedidos</span>
            </div>
          </div>

          <ul className="menu-list">
            <li>
              <Link className="menu-item" to="/puntos">
                <span className="icono">⭐</span>
                <span className="texto">
                  <strong>Puntos LevelUp</strong>
                  <small id="menu-puntos-detalle">
                    {puntos} puntos disponibles
                  </small>
                </span>
                <span className="chevron">›</span>
              </Link>
            </li>
            <li>
              <Link className="menu-item" to="/pedidos">
                <span className="icono">📦</span>
                <span className="texto">
                  <strong>Historial de Pedidos</strong>
                  <small id="menu-pedidos-detalle">
                    {usuario.pedidosRealizados} pedidos realizados
                  </small>
                </span>
                <span className="chevron">›</span>
              </Link>
            </li>

            {OPCIONES_PROXIMAMENTE.map((opcion) => (
              <li key={opcion.titulo}>
                <button
                  type="button"
                  className="menu-item"
                  onClick={() =>
                    LevelUp.toast(`${opcion.titulo}: próximamente disponible`)
                  }
                >
                  <span className="icono">{opcion.icono}</span>
                  <span className="texto">
                    <strong>{opcion.titulo}</strong>
                    <small>{opcion.detalle}</small>
                  </span>
                  <span className="chevron">›</span>
                </button>
              </li>
            ))}

            <li>
              <button
                type="button"
                className="menu-item peligro"
                id="btn-cerrar-sesion"
                onClick={cerrarSesion}
              >
                <span className="icono">🚪</span>
                <span className="texto">
                  <strong>Cerrar Sesión</strong>
                </span>
              </button>
            </li>
          </ul>
        </main>
      </div>

      {/* Modal: formulario "Actualizar" datos del perfil */}
      <div
        className="modal fade"
        id="modal-editar-perfil"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-black text-white border border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">Actualizar mis datos</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
                ref={cerrarModalRef}
              ></button>
            </div>

            <form id="form-editar-perfil" noValidate onSubmit={guardarCambios}>
              <div className="modal-body">
                {CAMPOS.map((campo) => (
                  <div className="campo-form mb-3" key={campo.id}>
                    <label
                      className="form-label small text-secondary"
                      htmlFor={campo.id}
                    >
                      {campo.label}
                    </label>
                    <input
                      type={campo.type}
                      id={campo.id}
                      name={campo.name}
                      className={`form-control bg-dark text-white border-secondary ${claseCampo(
                        campo.name
                      )}`}
                      placeholder={campo.placeholder}
                      value={formulario[campo.name]}
                      onChange={manejarCambio}
                    />
                    <div className="invalid-feedback">{errores[campo.name]}</div>
                  </div>
                ))}
              </div>

              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary fw-bold">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}