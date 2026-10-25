import { Fragment, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LevelUp from "../services/tienda.js";
import "../css/estilos.css";
import "../css/compras.css";

const OPCIONES_ENVIO = [
  { valor: "estandar", titulo: "Estándar (3-5 días hábiles)", detalle: "Sin costo adicional", precio: 0, etiqueta: "Gratis", dias: [3, 5] },
  { valor: "express", titulo: "Express (1-2 días hábiles)", detalle: "Llega más rápido", precio: 4990, etiqueta: "$4.990", dias: [1, 2] },
  { valor: "mismo-dia", titulo: "Mismo día (solo RM)", detalle: "Pedidos antes de las 14:00", precio: 9990, etiqueta: "$9.990", dias: [0, 0] },
];

const OPCIONES_PAGO = [
  { valor: "Webpay Débito", detalle: "Pago inmediato desde tu cuenta" },
  { valor: "Webpay Crédito", detalle: "Hasta 3 cuotas sin interés" },
  { valor: "Transferencia Bancaria", detalle: "Confirmación manual (24 hrs)" },
];

const REGIONES = [
  "Región Metropolitana",
  "Valparaíso",
  "Biobío",
  "Los Lagos",
  "Antofagasta",
  "Coquimbo",
  "Otra",
];

const PASOS = ["Envío", "Pago", "Confirmar"];

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const ID_CAMPO = {
  nombre: "envio-nombre",
  direccion: "envio-direccion",
  ciudad: "envio-ciudad",
  region: "envio-region",
  telefono: "envio-telefono",
};

// Mismas reglas y mensajes que pago.js (usa LevelUp.Validar)
function validarEnvio(valores) {
  const { Validar } = LevelUp;

  const reglas = {
    nombre: [{ test: Validar.requerido, mensaje: "Ingresa tu nombre completo." }],
    direccion: [{ test: Validar.requerido, mensaje: "Ingresa tu dirección." }],
    ciudad: [{ test: Validar.requerido, mensaje: "Ingresa tu ciudad." }],
    region: [{ test: Validar.requerido, mensaje: "Selecciona una región." }],
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

// Devuelve el mensaje del primer error, o null si la tarjeta es válida
function validarTarjeta({ titular, numero, vencimiento, cvv }) {
  if (titular.trim().length < 3) return "Ingresa un nombre válido para el titular.";
  if (!/^\d{16}$/.test(numero.replace(/\s/g, ""))) return "El número de tarjeta debe tener 16 dígitos.";
  if (!/^\d{2}\/\d{2}$/.test(vencimiento.trim())) return "El vencimiento debe tener formato MM/AA.";
  if (!/^\d{3}$/.test(cvv.trim())) return "El CVV debe tener 3 dígitos.";
  return null;
}

export default function ProcesoPago() {
  const navigate = useNavigate();
  const confirmando = useRef(false);

  // Se toma una "foto" del carrito al entrar: al confirmar se vacía,
  // y la página no debe reaccionar a ese cambio redirigiendo al carrito
  const [items] = useState(() => LevelUp.Carrito.obtenerItems());
  const [totales] = useState(() => LevelUp.Carrito.calcularTotales());

  const [paso, setPaso] = useState(1);

  const [envio, setEnvio] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    region: "",
    telefono: "",
  });
  const [errores, setErrores] = useState({});
  const [intentadoEnvio, setIntentadoEnvio] = useState(false);

  const [metodoEnvio, setMetodoEnvio] = useState("estandar");
  const [metodoPago, setMetodoPago] = useState("Webpay Débito");

  const [tarjeta, setTarjeta] = useState({
    titular: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = "Level-Up Gamer - Proceso de Pago";
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paso]);

  // Si el carrito está vacío, no tiene sentido pagar: volvemos al carrito
  if (items.length === 0) return <Navigate to="/carrito" replace />;

  const opcionEnvio = OPCIONES_ENVIO.find((o) => o.valor === metodoEnvio);
  const totalConEnvio = totales.total + opcionEnvio.precio;
  const esTransferencia = metodoPago === "Transferencia Bancaria";

  function cambiarEnvio(evento) {
    const { name, value } = evento.target;
    setEnvio((anterior) => ({ ...anterior, [name]: value }));
  }

  function cambiarTarjeta(evento) {
    const { name, value } = evento.target;
    setTarjeta((anterior) => ({ ...anterior, [name]: value }));
  }

  // is-invalid / is-valid, igual que Validar.marcarInvalido / marcarValido
  function claseCampo(campo) {
    if (errores[campo]) return "is-invalid";
    return intentadoEnvio ? "is-valid" : "";
  }

  // ---- Paso 1: validar dirección de envío ----
  function enviarPaso1(evento) {
    evento.preventDefault();

    const nuevosErrores = validarEnvio(envio);
    setErrores(nuevosErrores);
    setIntentadoEnvio(true);

    const primerInvalido = Object.keys(ID_CAMPO).find((c) => nuevosErrores[c]);
    if (primerInvalido) {
      document.getElementById(ID_CAMPO[primerInvalido])?.focus();
      return;
    }

    setPaso(2);
  }

  // ---- Paso 2: método de pago ----
  function enviarPaso2(evento) {
    evento.preventDefault();

    if (!esTransferencia) {
      const mensaje = validarTarjeta(tarjeta);
      if (mensaje) {
        alert(mensaje);
        return;
      }
    }

    setPaso(3);
  }

  // ---- Paso 3: confirmar y crear el pedido ----
  function confirmarPedido() {
    if (confirmando.current) return; // evita crear dos pedidos con doble clic
    confirmando.current = true;

    const [diasDesde, diasHasta] = opcionEnvio.dias;
    const hoy = new Date();
    const desde = new Date(hoy);
    desde.setDate(desde.getDate() + diasDesde);
    const hasta = new Date(hoy);
    hasta.setDate(hasta.getDate() + diasHasta);

    const entregaEstimada =
      diasDesde === diasHasta
        ? "Hoy mismo"
        : `${desde.getDate()} – ${hasta.getDate()} de ${MESES[hasta.getMonth()]}`;

    // Fecha local (toISOString usa UTC y de noche daría el día siguiente)
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

    const pedido = {
      id: LevelUp.Pedidos.generarId(),
      fecha,
      items: items.reduce((acc, i) => acc + i.cantidad, 0),
      productos: items,
      estado: "en_camino",
      total: totalConEnvio,
      pago: metodoPago,
      entregaEstimada,
      puntosGanados: Math.round(totalConEnvio / 80),
      envio: {
        nombre: envio.nombre.trim(),
        direccion: `${envio.direccion.trim()}, ${envio.ciudad.trim()}, ${envio.region}`,
      },
    };

    LevelUp.Pedidos.crear(pedido);
    LevelUp.guardarPedidoEnCurso(pedido);

    // Solo se suman puntos si hay una sesión iniciada
    if (localStorage.getItem("lug_user")) {
      const usuarioActual = LevelUp.Usuario.obtener();
      LevelUp.Usuario.actualizar({
        puntos: usuarioActual.puntos + pedido.puntosGanados,
        pedidosRealizados: usuarioActual.pedidosRealizados + 1,
      });
    }

    LevelUp.Carrito.vaciar();

    navigate("/confirmacion");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/carrito" className="back-arrow" aria-label="Volver">
          ←
        </Link>
        <h1 className="page-title">Proceso de Pago</h1>
        <span style={{ width: "1.3rem" }}></span>
      </header>

      <main className="container px-3 pb-5">
        {/* Indicador de pasos */}
        <div className="pasos-checkout">
          {PASOS.map((etiqueta, indice) => {
            const numero = indice + 1;
            return (
              <Fragment key={etiqueta}>
                {indice > 0 && <div className="linea-paso"></div>}
                <div
                  className={`paso ${numero === paso ? "activo" : ""} ${
                    numero < paso ? "completado" : ""
                  }`}
                >
                  <span className="circulo">{numero}</span>
                  {etiqueta}
                </div>
              </Fragment>
            );
          })}
        </div>

        {/* Paso 1: dirección de envío */}
        <form
          id="form-envio"
          className={`paso-form ${paso === 1 ? "activo" : ""}`}
          noValidate
          onSubmit={enviarPaso1}
        >
          <p className="seccion-titulo">Dirección de envío</p>

          <div className="campo-form mb-3">
            <label htmlFor="envio-nombre" className="form-label">
              Nombre completo
            </label>
            <input
              type="text"
              id="envio-nombre"
              name="nombre"
              className={`form-control bg-dark text-white border-secondary ${claseCampo("nombre")}`}
              placeholder="Ej: Juan Pérez"
              value={envio.nombre}
              onChange={cambiarEnvio}
            />
            <div className="invalid-feedback">{errores.nombre}</div>
          </div>

          <div className="campo-form mb-3">
            <label htmlFor="envio-direccion" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              id="envio-direccion"
              name="direccion"
              className={`form-control bg-dark text-white border-secondary ${claseCampo("direccion")}`}
              placeholder="Calle, número y depto."
              value={envio.direccion}
              onChange={cambiarEnvio}
            />
            <div className="invalid-feedback">{errores.direccion}</div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6 campo-form">
              <label htmlFor="envio-ciudad" className="form-label">
                Ciudad
              </label>
              <input
                type="text"
                id="envio-ciudad"
                name="ciudad"
                className={`form-control bg-dark text-white border-secondary ${claseCampo("ciudad")}`}
                placeholder="Ej: Santiago"
                value={envio.ciudad}
                onChange={cambiarEnvio}
              />
              <div className="invalid-feedback">{errores.ciudad}</div>
            </div>

            <div className="col-6 campo-form">
              <label htmlFor="envio-region" className="form-label">
                Región
              </label>
              <select
                id="envio-region"
                name="region"
                className={`form-select bg-dark text-white border-secondary ${claseCampo("region")}`}
                value={envio.region}
                onChange={cambiarEnvio}
              >
                <option value="" disabled>
                  Selecciona una región
                </option>
                {REGIONES.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errores.region}</div>
            </div>
          </div>

          <div className="campo-form mb-4">
            <label htmlFor="envio-telefono" className="form-label">
              Número de teléfono
            </label>
            <input
              type="tel"
              id="envio-telefono"
              name="telefono"
              className={`form-control bg-dark text-white border-secondary ${claseCampo("telefono")}`}
              placeholder="+56 9 xxxx xxxx"
              value={envio.telefono}
              onChange={cambiarEnvio}
            />
            <div className="invalid-feedback">{errores.telefono}</div>
          </div>

          <p className="seccion-titulo">Método de envío</p>
          {OPCIONES_ENVIO.map((opcion) => (
            <label
              className={`opcion-radio ${metodoEnvio === opcion.valor ? "seleccionado" : ""}`}
              key={opcion.valor}
            >
              <input
                type="radio"
                name="metodo-envio"
                value={opcion.valor}
                checked={metodoEnvio === opcion.valor}
                onChange={() => setMetodoEnvio(opcion.valor)}
              />
              <span className="detalle">
                <strong>{opcion.titulo}</strong>
                <small>{opcion.detalle}</small>
              </span>
              <span className="precio-opcion">{opcion.etiqueta}</span>
            </label>
          ))}

          <div className="summary-box mt-3">
            <div className="summary-row total">
              <span>Total del pedido</span>
              <span id="total-paso1">{LevelUp.formatCLP(totalConEnvio)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold text-uppercase py-2"
          >
            Continuar al pago →
          </button>
        </form>

        {/* Paso 2: método de pago */}
        <form
          id="form-pago"
          className={`paso-form ${paso === 2 ? "activo" : ""}`}
          noValidate
          onSubmit={enviarPaso2}
        >
          <p className="seccion-titulo">Método de pago</p>

          {OPCIONES_PAGO.map((opcion) => (
            <label
              className={`opcion-radio ${metodoPago === opcion.valor ? "seleccionado" : ""}`}
              key={opcion.valor}
            >
              <input
                type="radio"
                name="metodo-pago"
                value={opcion.valor}
                checked={metodoPago === opcion.valor}
                onChange={() => setMetodoPago(opcion.valor)}
              />
              <span className="detalle">
                <strong>{opcion.valor}</strong>
                <small>{opcion.detalle}</small>
              </span>
            </label>
          ))}

          {!esTransferencia && (
            <div id="datos-tarjeta" className="mt-4">
              <p className="seccion-titulo">Datos de la tarjeta</p>

              <div className="campo-form mb-3">
                <label htmlFor="tarjeta-titular" className="form-label">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  id="tarjeta-titular"
                  name="titular"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Ej: Juan Pérez"
                  value={tarjeta.titular}
                  onChange={cambiarTarjeta}
                />
              </div>

              <div className="campo-form mb-3">
                <label htmlFor="tarjeta-numero" className="form-label">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  id="tarjeta-numero"
                  name="numero"
                  inputMode="numeric"
                  autoComplete="off"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="0000 0000 0000 0000"
                  value={tarjeta.numero}
                  onChange={cambiarTarjeta}
                />
              </div>

              <div className="row g-2">
                <div className="col-6 campo-form">
                  <label htmlFor="tarjeta-vencimiento" className="form-label">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    id="tarjeta-vencimiento"
                    name="vencimiento"
                    autoComplete="off"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="MM/AA"
                    value={tarjeta.vencimiento}
                    onChange={cambiarTarjeta}
                  />
                </div>

                <div className="col-6 campo-form">
                  <label htmlFor="tarjeta-cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    type="password"
                    id="tarjeta-cvv"
                    name="cvv"
                    autoComplete="off"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="123"
                    value={tarjeta.cvv}
                    onChange={cambiarTarjeta}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-light w-50"
              onClick={() => setPaso(1)}
            >
              ← Volver
            </button>
            <button
              type="submit"
              className="btn btn-primary w-50 fw-bold text-uppercase"
            >
              Continuar →
            </button>
          </div>
        </form>

        {/* Paso 3: confirmar */}
        <div
          id="paso-confirmar"
          className={`paso-form ${paso === 3 ? "activo" : ""}`}
        >
          <p className="seccion-titulo">Resumen del pedido</p>

          <div className="summary-box">
            <div className="summary-row">
              <span>Envío a</span>
              <span id="resumen-nombre">{envio.nombre.trim()}</span>
            </div>
            <div className="summary-row">
              <span>Dirección</span>
              <span id="resumen-direccion">
                {`${envio.direccion.trim()}, ${envio.ciudad.trim()}, ${envio.region}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Método de envío</span>
              <span id="resumen-metodo-envio">{opcionEnvio.titulo}</span>
            </div>
            <div className="summary-row">
              <span>Método de pago</span>
              <span id="resumen-metodo-pago">{metodoPago}</span>
            </div>
            <div className="summary-row total">
              <span>Total a pagar</span>
              <span id="total-paso3">{LevelUp.formatCLP(totalConEnvio)}</span>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-light w-50"
              onClick={() => setPaso(2)}
            >
              ← Volver
            </button>
            <button
              type="button"
              id="btn-confirmar-pedido"
              className="btn btn-confirmar w-50 fw-bold text-uppercase"
              onClick={confirmarPedido}
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}