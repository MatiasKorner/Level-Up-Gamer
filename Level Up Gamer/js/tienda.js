/* =======================================================================
   tienda.js — Capa de datos compartida (carrito, pedidos, perfil) +
   utilidades de validación de formularios. Se carga en: carrito.html,
   pago.html, confirmacion.html, perfil.html, puntos.html, pedidos.html.
   Usa localStorage para simular un backend (no hay servidor real).
   ======================================================================= */

const LevelUp = (() => {
  const KEYS = {
    CART: "lug_cart",
    PROMO: "lug_promo",
    ORDERS: "lug_orders",
    USER: "lug_user",
  };

  /* ---------- Utilidades ---------- */

  function formatCLP(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CL") + " CLP";
  }

  function leer(key, porDefecto) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(key, valor) {
    localStorage.setItem(key, JSON.stringify(valor));
  }

  function toast(mensaje) {
    let cont = document.getElementById("lug-toast-container");
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "lug-toast-container";
      cont.style.cssText =
        "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);" +
        "z-index:2000;display:flex;flex-direction:column;gap:8px;align-items:center;width:90%;max-width:500px;";
      document.body.appendChild(cont);
    }
    const el = document.createElement("div");
    el.textContent = mensaje;
    el.style.cssText =
      "background:#151515;border:1px solid #39FF14;color:#fff;padding:10px 16px;" +
      "border-radius:8px;font-size:0.8rem;box-shadow:0 4px 14px rgba(0,0,0,.5);opacity:0;transition:opacity .2s;";
    cont.appendChild(el);
    requestAnimationFrame(() => (el.style.opacity = "1"));
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 250);
    }, 2400);
  }

  /* ---------- Datos semilla (para que las páginas no partan vacías) ---------- */

  const CARRITO_SEMILLA = [
    { id: "phantom-strike", nombre: "Phantom Strike", variante: "PS5 Digital", precio: 49990, cantidad: 1, img: "img/producto-1.jpg" },
    { id: "grid-runner-x", nombre: "Grid Runner X", variante: "PC / Steam", precio: 39990, cantidad: 2, img: "img/producto-2.jpg" },
    { id: "audifonos-pro-x1", nombre: "Audífonos Pro X1", variante: "Universal", precio: 89990, cantidad: 1, img: "img/producto-3.jpg" },
  ];

  const PEDIDOS_SEMILLA = [
    {
      id: "LUG-08654", fecha: "2026-08-15", items: 1, estado: "entregado", total: 49990,
      productos: [{ id: "phantom-strike", nombre: "Phantom Strike", variante: "PS5 Digital", precio: 49990, cantidad: 1, img: "img/producto-1.jpg" }],
    },
    {
      id: "LUG-08583", fecha: "2026-08-02", items: 2, estado: "entregado", total: 129990,
      productos: [
        { id: "grid-runner-x", nombre: "Grid Runner X", variante: "PC / Steam", precio: 39990, cantidad: 1, img: "img/producto-2.jpg" },
        { id: "audifonos-pro-x1", nombre: "Audífonos Pro X1", variante: "Universal", precio: 89990, cantidad: 1, img: "img/producto-3.jpg" },
      ],
    },
    {
      id: "LUG-08401", fecha: "2026-07-18", items: 1, estado: "cancelado", total: 89990,
      productos: [{ id: "audifonos-pro-x1", nombre: "Audífonos Pro X1", variante: "Universal", precio: 89990, cantidad: 1, img: "img/producto-3.jpg" }],
    },
    {
      id: "LUG-08320", fecha: "2026-07-05", items: 4, estado: "entregado", total: 199980,
      productos: [
        { id: "phantom-strike", nombre: "Phantom Strike", variante: "PS5 Digital", precio: 49990, cantidad: 2, img: "img/producto-1.jpg" },
        { id: "grid-runner-x", nombre: "Grid Runner X", variante: "PC / Steam", precio: 39990, cantidad: 2, img: "img/producto-2.jpg" },
      ],
    },
    {
      id: "LUG-08108", fecha: "2026-06-12", items: 1, estado: "entregado", total: 44990,
      productos: [{ id: "grid-runner-x", nombre: "Grid Runner X", variante: "PC / Steam", precio: 39990, cantidad: 1, img: "img/producto-2.jpg" }],
    },
  ];

  const USER_SEMILLA = {
    nombre: "PlayerOne_CL",
    correo: "gamer@levelup.cl",
    telefono: "+56 9 1234 5678",
    nivel: 42,
    puntos: 8750,
    puntosSiguienteNivel: 12000,
    pedidosRealizados: 27,
  };

  /* ---------- Carrito ---------- */

  const Carrito = {
    obtenerItems() {
      return leer(KEYS.CART, null) ?? (guardar(KEYS.CART, CARRITO_SEMILLA), CARRITO_SEMILLA.slice());
    },
    guardarItems(items) {
      guardar(KEYS.CART, items);
    },
    agregar(producto) {
      const items = this.obtenerItems();
      const existente = items.find((i) => i.id === producto.id);
      if (existente) {
        existente.cantidad += producto.cantidad || 1;
      } else {
        items.push(Object.assign({ cantidad: 1 }, producto));
      }
      this.guardarItems(items);
    },
    actualizarCantidad(id, cantidad) {
      const items = this.obtenerItems();
      const item = items.find((i) => i.id === id);
      if (!item) return;
      item.cantidad = Math.max(1, cantidad);
      this.guardarItems(items);
    },
    eliminar(id) {
      const items = this.obtenerItems().filter((i) => i.id !== id);
      this.guardarItems(items);
    },
    vaciar() {
      this.guardarItems([]);
      localStorage.removeItem(KEYS.PROMO);
    },
    contarUnidades() {
      return this.obtenerItems().reduce((acc, i) => acc + i.cantidad, 0);
    },
    obtenerPromo() {
      return leer(KEYS.PROMO, "DUOC20");
    },
    aplicarPromo(codigo) {
      guardar(KEYS.PROMO, codigo);
    },
    calcularTotales() {
      const items = this.obtenerItems();
      const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
      const correo = localStorage.getItem("lug_correo") || "";
      const esDuoc = correo.toLowerCase().endsWith("@duocuc.cl");
      const descuentoPct = esDuoc ? 0.2 : 0;
      const descuento = Math.round(subtotal * descuentoPct);
      const envio = 0;
      const total = subtotal - descuento + envio;
      return { subtotal, descuento, descuentoPct, envio, total, esDuoc };
    },
  };

  /* ---------- Pedidos / Historial ---------- */

  const Pedidos = {
    obtenerTodos() {
      const guardados = leer(KEYS.ORDERS, null);
      if (guardados) return guardados;
      guardar(KEYS.ORDERS, PEDIDOS_SEMILLA);
      return PEDIDOS_SEMILLA.slice();
    },
    obtenerPorId(id) {
      return this.obtenerTodos().find((p) => p.id === id);
    },
    crear(pedido) {
      const todos = this.obtenerTodos();
      todos.unshift(pedido);
      guardar(KEYS.ORDERS, todos);
      return pedido;
    },
    generarId() {
      const n = Math.floor(10000 + Math.random() * 89999);
      return "LUG-" + n;
    },
  };

  /* ---------- Usuario / Perfil ---------- */

  const Usuario = {
    obtener() {
      return leer(KEYS.USER, null) ?? (guardar(KEYS.USER, USER_SEMILLA), Object.assign({}, USER_SEMILLA));
    },
    actualizar(datos) {
      const actual = this.obtener();
      const nuevo = Object.assign({}, actual, datos);
      guardar(KEYS.USER, nuevo);
      return nuevo;
    },
  };

  /* ---------- Envío / último pedido en curso (entre pago.html y confirmacion.html) ---------- */

  function guardarPedidoEnCurso(datos) {
    sessionStorage.setItem("lug_checkout", JSON.stringify(datos));
  }
  function leerPedidoEnCurso() {
    const raw = sessionStorage.getItem("lug_checkout");
    return raw ? JSON.parse(raw) : null;
  }
  function marcarPedidoAVer(id) {
    sessionStorage.setItem("lug_ver_pedido", id);
  }
  function leerPedidoAVer() {
    return sessionStorage.getItem("lug_ver_pedido");
  }

  /* ---------- Validación de formularios ---------- */

  const Validar = {
    requerido: (v) => v.trim().length > 0,
    minLargo: (min) => (v) => v.trim().length >= min,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    telefonoCL: (v) => /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(v.trim()),

    marcarInvalido(input, mensaje) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      let hint = input.parentElement.querySelector(".invalid-feedback");
      if (!hint) {
        hint = document.createElement("div");
        hint.className = "invalid-feedback";
        input.closest(".campo-form, .input-group, div").appendChild(hint);
      }
      hint.textContent = mensaje;
    },
    marcarValido(input) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    },

    /**
     * reglas: [{ input: HTMLElement, pruebas: [{ test: fn(valor)=>bool, mensaje }] }]
     * Devuelve true si TODO el formulario es válido.
     */
    validarFormulario(reglas) {
      let formularioValido = true;
      let primerInvalido = null;
      reglas.forEach(({ input, pruebas }) => {
        const valor = input.value || "";
        const fallo = pruebas.find((p) => !p.test(valor));
        if (fallo) {
          formularioValido = false;
          this.marcarInvalido(input, fallo.mensaje);
          if (!primerInvalido) primerInvalido = input;
        } else {
          this.marcarValido(input);
        }
      });
      if (primerInvalido) primerInvalido.focus();
      return formularioValido;
    },
  };

  return {
    formatCLP,
    toast,
    Carrito,
    Pedidos,
    Usuario,
    Validar,
    guardarPedidoEnCurso,
    leerPedidoEnCurso,
    marcarPedidoAVer,
    leerPedidoAVer,
  };
})();

/* Actualiza el contador del icono de carrito en el header, si existe en la página */
document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("cart-count-badge");
  if (badge) badge.textContent = LevelUp.Carrito.contarUnidades();
});
