/* pago.js — Lógica de la página pago.html (07): asistente de 3 pasos con validación */

document.addEventListener("DOMContentLoaded", () => {
  const formEnvio = document.getElementById("form-envio");
  const formPago = document.getElementById("form-pago");
  const pasoConfirmar = document.getElementById("paso-confirmar");

  const nombreInput = document.getElementById("envio-nombre");
  const direccionInput = document.getElementById("envio-direccion");
  const ciudadInput = document.getElementById("envio-ciudad");
  const regionInput = document.getElementById("envio-region");
  const telefonoInput = document.getElementById("envio-telefono");

  // Si el carrito está vacío, no tiene sentido pagar: volvemos al carrito.
  if (LevelUp.Carrito.obtenerItems().length === 0) {
    window.location.href = "carrito.html";
    return;
  }

  function calcularEnvioSeleccionado() {
    const seleccionado = document.querySelector('input[name="metodo-envio"]:checked');
    return Number(seleccionado?.dataset.precio || 0);
  }

  function actualizarTotales() {
    const totales = LevelUp.Carrito.calcularTotales();
    const envio = calcularEnvioSeleccionado();
    const totalConEnvio = totales.total + envio;
    document.getElementById("total-paso1").textContent = LevelUp.formatCLP(totalConEnvio);
    document.getElementById("total-paso3").textContent = LevelUp.formatCLP(totalConEnvio);
    return totalConEnvio;
  }

  // Resalta visualmente la opción de radio seleccionada (respaldo de :has() para navegadores viejos)
  function marcarOpcionesSeleccionadas() {
    document.querySelectorAll(".opcion-radio").forEach((label) => {
      const input = label.querySelector("input");
      label.classList.toggle("seleccionado", input.checked);
    });
  }

  document.querySelectorAll('input[name="metodo-envio"]').forEach((r) =>
    r.addEventListener("change", () => {
      actualizarTotales();
      marcarOpcionesSeleccionadas();
    })
  );
  document.querySelectorAll('input[name="metodo-pago"]').forEach((r) =>
    r.addEventListener("change", marcarOpcionesSeleccionadas)
  );

  function irAPaso(n) {
    [formEnvio, formPago, pasoConfirmar].forEach((el) => el.classList.remove("activo"));
    document.querySelectorAll(".paso").forEach((p) => p.classList.remove("activo", "completado"));

    if (n === 1) formEnvio.classList.add("activo");
    if (n === 2) formPago.classList.add("activo");
    if (n === 3) pasoConfirmar.classList.add("activo");

    document.querySelectorAll(".paso").forEach((p) => {
      const num = Number(p.dataset.paso);
      if (num < n) p.classList.add("completado");
      if (num === n) p.classList.add("activo");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-volver]").forEach((btn) =>
    btn.addEventListener("click", () => irAPaso(Number(btn.dataset.volver)))
  );

  // ---- Paso 1: validar dirección de envío ----
  formEnvio.addEventListener("submit", (e) => {
    e.preventDefault();

    const valido = LevelUp.Validar.validarFormulario([
      { input: nombreInput, pruebas: [{ test: LevelUp.Validar.requerido, mensaje: "Ingresa tu nombre completo." }] },
      { input: direccionInput, pruebas: [{ test: LevelUp.Validar.requerido, mensaje: "Ingresa tu dirección." }] },
      { input: ciudadInput, pruebas: [{ test: LevelUp.Validar.requerido, mensaje: "Ingresa tu ciudad." }] },
      { input: regionInput, pruebas: [{ test: LevelUp.Validar.requerido, mensaje: "Selecciona una región." }] },
      {
        input: telefonoInput,
        pruebas: [
          { test: LevelUp.Validar.requerido, mensaje: "Ingresa tu teléfono." },
          { test: LevelUp.Validar.telefonoCL, mensaje: "Formato esperado: +56 9 xxxx xxxx." },
        ],
      },
    ]);

    if (!valido) return;
    irAPaso(2);
  });

  // ---- Paso 2: seleccionar método de pago ----
  formPago.addEventListener("submit", (e) => {
    e.preventDefault();

    const metodoEnvio = document.querySelector('input[name="metodo-envio"]:checked').closest(".opcion-radio").querySelector("strong").textContent;
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;

    document.getElementById("resumen-nombre").textContent = nombreInput.value.trim();
    document.getElementById("resumen-direccion").textContent =
      `${direccionInput.value.trim()}, ${ciudadInput.value.trim()}, ${regionInput.value}`;
    document.getElementById("resumen-metodo-envio").textContent = metodoEnvio;
    document.getElementById("resumen-metodo-pago").textContent = metodoPago;

    actualizarTotales();
    irAPaso(3);
  });

  // ---- Paso 3: confirmar y crear el pedido ----
  document.getElementById("btn-confirmar-pedido").addEventListener("click", () => {
    const items = LevelUp.Carrito.obtenerItems();
    const totalConEnvio = actualizarTotales();
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;

    const metodoEnvioValor = document.querySelector('input[name="metodo-envio"]:checked').value;
    const rangoDias = { estandar: [3, 5], express: [1, 2], "mismo-dia": [0, 0] }[metodoEnvioValor] || [3, 5];

    const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const hoy = new Date();
    const desde = new Date(hoy);
    desde.setDate(desde.getDate() + rangoDias[0]);
    const hasta = new Date(hoy);
    hasta.setDate(hasta.getDate() + rangoDias[1]);
    const entregaEstimada =
      rangoDias[0] === rangoDias[1]
        ? `Hoy mismo`
        : `${desde.getDate()} – ${hasta.getDate()} de ${MESES[hasta.getMonth()]}`;

    const pedido = {
      id: LevelUp.Pedidos.generarId(),
      fecha: hoy.toISOString().slice(0, 10),
      items: items.reduce((acc, i) => acc + i.cantidad, 0),
      productos: items,
      estado: "en_camino",
      total: totalConEnvio,
      pago: metodoPago,
      entregaEstimada,
      puntosGanados: Math.round(totalConEnvio / 80),
      envio: {
        nombre: nombreInput.value.trim(),
        direccion: `${direccionInput.value.trim()}, ${ciudadInput.value.trim()}, ${regionInput.value}`,
      },
    };

    LevelUp.Pedidos.crear(pedido);
    LevelUp.guardarPedidoEnCurso(pedido);
    LevelUp.Carrito.vaciar();

    window.location.href = "confirmacion.html";
  });

  actualizarTotales();
  marcarOpcionesSeleccionadas();
});
