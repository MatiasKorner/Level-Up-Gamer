const botonesMenu = document.querySelectorAll(".admin-menu-btn");
const secciones = document.querySelectorAll(".admin-seccion");

botonesMenu.forEach(boton => {

  boton.addEventListener("click", () => {

    // Ocultar todas las secciones
    secciones.forEach(seccion => {
      seccion.style.display = "none";
    });

    // Quitar el estado activo de todos los botones
    botonesMenu.forEach(btn => {
      btn.classList.remove("activo");
    });

    // Saber qué sección quiere abrir el usuario
    const nombreSeccion = boton.dataset.seccion;

    // Mostrar esa sección
    document.getElementById(
      "seccion-" + nombreSeccion
    ).style.display = "block";

    // Marcar el botón seleccionado
    boton.classList.add("activo");
  });

});
const rolUsuario = localStorage.getItem("lug_rol");
const columnaAcciones = document.getElementById("columna-acciones");
const botonAgregarProducto = document.getElementById("btn-agregar-producto");
const textoRol = document.getElementById("admin-rol");
const elementosSoloAdmin = document.querySelectorAll(".solo-admin");

if (!rolUsuario) {
  window.location.href = "login.html";
}

if (textoRol) {
  textoRol.textContent = rolUsuario;
}

if (rolUsuario === "Vendedor") {

  elementosSoloAdmin.forEach(elemento => {
    elemento.style.display = "none";
  });

  if (columnaAcciones) {
    columnaAcciones.style.display = "none";
  }

  if (botonAgregarProducto) {
    botonAgregarProducto.style.display = "none";
  }
}

const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");

if (botonCerrarSesion) {
  botonCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("lug_correo");
    localStorage.removeItem("lug_rol");

    window.location.href = "login.html";
  });
}
const productos = [
  {
    id: "Mando",
    nombre: "Mando DualSense PS5",
    precio: 64990,
    categoria: "Consolas"
  },
  {
    id: "Auris",
    nombre: "Audífonos HyperX Cloud II",
    precio: 89990,
    categoria: "PC"
  },
  {
    id: "Teclado",
    nombre: "Teclado Redragon Kumara",
    precio: 32990,
    categoria: "PC"
  },
  {
    id: "Mouse",
    nombre: "Mouse Logitech G305",
    precio: 29990,
    categoria: "PC"
  },
  {
    id: "Gta",
    nombre: "Grand Theft Auto VI (PS5)",
    precio: 69990,
    categoria: "Consolas"
  },
  {
    id: "EA-FC",
    nombre: "EA Sports FC 26",
    precio: 54990,
    categoria: "Consolas"
  },
  {
    id: "Mousepad",
    nombre: "Mousepad Monster Games USB RGB Negro",
    precio: 9990,
    categoria: "PC"
  }
];
const tablaProductos = document.getElementById("tabla-productos");

function mostrarProductos() {

  tablaProductos.innerHTML = "";

  productos.forEach(producto => {

    const fila = document.createElement("tr");

    let acciones = "";

    if (rolUsuario === "Administrador") {
      acciones = `
        <td>
          <button
            class="btn-editar"
            onclick="editarProducto('${producto.id}')">
            Editar
          </button>

          <button
            class="btn-eliminar"
            onclick="eliminarProducto('${producto.id}')">
            Eliminar
          </button>
        </td>
      `;
    }

    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>$${producto.precio.toLocaleString("es-CL")}</td>
      ${acciones}
    `;

    tablaProductos.appendChild(fila);
  });

}
mostrarProductos();

function eliminarProducto(id) {

  const indice = productos.findIndex(producto => producto.id === id);

  if (indice !== -1) {
    productos.splice(indice, 1);
    mostrarProductos();
  }
}
function editarProducto(id) {

  const producto = productos.find(producto => producto.id === id);

  if (!producto) {
    return;
  }

  const nuevoNombre = prompt(
    "Nombre del producto:",
    producto.nombre
  );

  if (nuevoNombre === null) {
    return;
  }

  const nuevaCategoria = prompt(
    "Categoría:",
    producto.categoria
  );

  if (nuevaCategoria === null) {
    return;
  }

  const nuevoPrecio = prompt(
    "Precio:",
    producto.precio
  );

  if (nuevoPrecio === null) {
    return;
  }

  producto.nombre = nuevoNombre.trim();
  producto.categoria = nuevaCategoria.trim();
  producto.precio = Number(nuevoPrecio);

  mostrarProductos();
}

botonAgregarProducto.addEventListener("click", () => {

  const id = prompt("ID del producto:");
  if (!id) return;

  const nombre = prompt("Nombre del producto:");
  if (!nombre) return;

  const categoria = prompt("Categoría:");
  if (!categoria) return;

  const precio = prompt("Precio:");
  if (!precio) return;

  const nuevoProducto = {
    id: id.trim(),
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    precio: Number(precio)
  };

  productos.push(nuevoProducto);

  mostrarProductos();
});
const tablaPedidos = document.getElementById("tabla-pedidos");

function mostrarPedidos() {

  const pedidos = JSON.parse(
    localStorage.getItem("lug_orders")
  ) || [];

  tablaPedidos.innerHTML = "";

  pedidos.forEach(pedido => {

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.fecha}</td>
      <td>${pedido.items}</td>
      <td>$${pedido.total.toLocaleString("es-CL")}</td>
      <td>${pedido.estado}</td>
    `;

    tablaPedidos.appendChild(fila);
  });
}

mostrarPedidos();
const tablaUsuarios = document.getElementById("tabla-usuarios");

function mostrarUsuarios() {

  const usuarioRegistrado = JSON.parse(
    localStorage.getItem("lug_usuario_registrado")
  );

  tablaUsuarios.innerHTML = "";

  if (!usuarioRegistrado) {
    tablaUsuarios.innerHTML = `
      <tr>
        <td colspan="3">No hay usuarios registrados.</td>
      </tr>
    `;
    return;
  }

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${usuarioRegistrado.nombre}</td>
    <td>${usuarioRegistrado.correo}</td>
    <td>Cliente</td>
  `;

  tablaUsuarios.appendChild(fila);
}

mostrarUsuarios();