import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../css/base.css";
import "../css/admin.css";

const PRODUCTOS_INICIALES = [
  { id: "Mando", nombre: "Mando DualSense PS5", precio: 64990, categoria: "Consolas" },
  { id: "Auris", nombre: "Audífonos HyperX Cloud II", precio: 89990, categoria: "PC" },
  { id: "Teclado", nombre: "Teclado Redragon Kumara", precio: 32990, categoria: "PC" },
  { id: "Mouse", nombre: "Mouse Logitech G305", precio: 29990, categoria: "PC" },
  { id: "Gta", nombre: "Grand Theft Auto VI (PS5)", precio: 69990, categoria: "Consolas" },
  { id: "EA-FC", nombre: "EA Sports FC 26", precio: 54990, categoria: "Consolas" },
  { id: "Mousepad", nombre: "Mousepad Monster Games USB RGB Negro", precio: 9990, categoria: "PC" },
];

const SECCIONES = [
  { id: "inicio", etiqueta: "🏠 Inicio", soloAdmin: false },
  { id: "productos", etiqueta: "🎮 Productos", soloAdmin: false },
  { id: "pedidos", etiqueta: "📦 Pedidos", soloAdmin: false },
  { id: "usuarios", etiqueta: "👥 Usuarios", soloAdmin: true },
];

function leerJSON(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave));
  } catch {
    return null;
  }
}

export default function MenuAdmin() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("lug_rol");

  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = "Administración | Level-Up Gamer";
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  // Sin rol: al login
  if (!rol) return <Navigate to="/login" replace />;

  const esAdmin = rol === "Administrador";
  const esVendedor = rol === "Vendedor";

  // Pedidos y usuarios se leen de localStorage
  const pedidos = leerJSON("lug_orders") || [];
  const usuarioRegistrado = leerJSON("lug_usuario_registrado");

  function estiloSeccion(id) {
    return { display: seccionActiva === id ? "block" : "none" };
  }

  function cerrarSesion() {
    localStorage.removeItem("lug_correo");
    localStorage.removeItem("lug_rol");
    navigate("/login");
  }

  function eliminarProducto(id) {
    setProductos((anteriores) => anteriores.filter((p) => p.id !== id));
  }

  function editarProducto(id) {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    const nuevoNombre = prompt("Nombre del producto:", producto.nombre);
    if (nuevoNombre === null) return;

    const nuevaCategoria = prompt("Categoría:", producto.categoria);
    if (nuevaCategoria === null) return;

    const nuevoPrecio = prompt("Precio:", producto.precio);
    if (nuevoPrecio === null) return;

    const precio = Number(nuevoPrecio);
    if (Number.isNaN(precio) || precio < 0) {
      alert("Ingresa un precio válido.");
      return;
    }

    setProductos((anteriores) =>
      anteriores.map((p) =>
        p.id === id
          ? {
              ...p,
              nombre: nuevoNombre.trim(),
              categoria: nuevaCategoria.trim(),
              precio,
            }
          : p
      )
    );
  }

  function agregarProducto() {
    const id = prompt("ID del producto:");
    if (!id) return;

    const nombre = prompt("Nombre del producto:");
    if (!nombre) return;

    const categoria = prompt("Categoría:");
    if (!categoria) return;

    const textoPrecio = prompt("Precio:");
    if (!textoPrecio) return;

    const precio = Number(textoPrecio);
    if (Number.isNaN(precio) || precio < 0) {
      alert("Ingresa un precio válido.");
      return;
    }

    if (productos.some((p) => p.id === id.trim())) {
      alert("Ya existe un producto con ese ID.");
      return;
    }

    setProductos((anteriores) => [
      ...anteriores,
      {
        id: id.trim(),
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio,
      },
    ]);
  }

  return (
    // Contenedor en columna: .admin-layout usa flex: 1 para ocupar el alto restante
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header className="admin-header">
        <Link to="/" className="admin-logo">
          LEVEL-<span>UP</span>
        </Link>

        <div className="admin-usuario">
          <span id="admin-rol">{rol}</span>
          <button id="btn-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Menú lateral */}
        <aside className="admin-sidebar">
          <h2>Administración</h2>

          <nav className="admin-menu">
            {SECCIONES.filter((s) => !(s.soloAdmin && esVendedor)).map((s) => (
              <button
                key={s.id}
                className={`admin-menu-btn ${
                  seccionActiva === s.id ? "activo" : ""
                }`}
                onClick={() => setSeccionActiva(s.id)}
              >
                {s.etiqueta}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="admin-contenido">
          <section
            id="seccion-inicio"
            className="admin-seccion"
            style={estiloSeccion("inicio")}
          >
            <h1>Panel de administración</h1>
            <p>Bienvenido al sistema administrativo de Level-Up Gamer.</p>
          </section>

          <section
            id="seccion-productos"
            className="admin-seccion"
            style={estiloSeccion("productos")}
          >
            <h1>Productos</h1>

            {!esVendedor && (
              <button
                id="btn-agregar-producto"
                className="btn-editar solo-admin"
                onClick={agregarProducto}
              >
                Agregar producto
              </button>
            )}

            <div className="tabla-contenedor">
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    {esAdmin && <th id="columna-acciones">Acciones</th>}
                  </tr>
                </thead>

                <tbody id="tabla-productos">
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>${producto.precio.toLocaleString("es-CL")}</td>
                      {esAdmin && (
                        <td>
                          <button
                            className="btn-editar"
                            onClick={() => editarProducto(producto.id)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn-eliminar"
                            onClick={() => eliminarProducto(producto.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="seccion-pedidos"
            className="admin-seccion"
            style={estiloSeccion("pedidos")}
          >
            <h1>Pedidos</h1>

            <div className="tabla-contenedor">
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody id="tabla-pedidos">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.fecha}</td>
                      <td>{pedido.items}</td>
                      <td>${Number(pedido.total).toLocaleString("es-CL")}</td>
                      <td>{pedido.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {!esVendedor && (
            <section
              id="seccion-usuarios"
              className="admin-seccion"
              style={estiloSeccion("usuarios")}
            >
              <h1>Usuarios</h1>

              <div className="tabla-contenedor">
                <table className="tabla-admin">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                    </tr>
                  </thead>

                  <tbody id="tabla-usuarios">
                    {usuarioRegistrado ? (
                      <tr>
                        <td>{usuarioRegistrado.nombre}</td>
                        <td>{usuarioRegistrado.correo}</td>
                        <td>Cliente</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={3}>No hay usuarios registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}