/* =======================================================================
   productos.js — Fuente de datos simulada (como una "base de datos") para
   los productos de la tienda. Incluye las 4 operaciones CRUD:
   Crear, Leer, Actualizar y Eliminar.

   Los datos se guardan en localStorage, así los cambios se mantienen
   al recargar la página (esto prepara el panel de administración).
   ======================================================================= */

const CLAVE = "lug_productos";

// Datos con los que parte la tienda la primera vez que se abre
const PRODUCTOS_INICIALES = [
  {
    id: "mando",
    nombre: "Mando DualSense PS5",
    precio: 64990,
    imagen: "mando.jpg",
    alt: "Mando DualSense PS5",
    categorias: "consolas tendencias accesorios",
    descripcion: "Siente una inmersión física en tus juegos de PS5 con la retroalimentación háptica y gatillos adaptables.",
  },
  {
    id: "auris",
    nombre: "Audífonos HyperX Cloud II",
    precio: 89990,
    imagen: "auris.webp",
    alt: "Audífonos HyperX Cloud II",
    categorias: "accesorios tendencias",
    descripcion: "Sonido envolvente 7.1 con almohadillas viscoelásticas para máxima comodidad.",
  },
  {
    id: "teclado",
    nombre: "Teclado Redragon Kumara",
    precio: 32990,
    imagen: "teclado.webp",
    alt: "Teclado Redragon Kumara",
    categorias: "accesorios tendencias",
    descripcion: "Teclado mecánico compacto TKL con iluminación RGB y switches mecánicos de alta durabilidad.",
  },
  {
    id: "mouse",
    nombre: "Mouse Logitech G305",
    precio: 29990,
    imagen: "mouse.webp",
    alt: "Mouse Logitech G305",
    categorias: "mouse tendencias",
    descripcion: "Inalámbrico con tecnología LIGHTSPEED, sensor HERO de 12.000 DPI y autonomía excepcional.",
  },
  {
    id: "gta",
    nombre: "Grand Theft Auto VI (PS5)",
    precio: 69990,
    imagen: "gta.webp",
    alt: "Grand Theft Auto VI para PS5",
    categorias: "consolas tendencias",
    descripcion: "Reserva oficial de la próxima entrega de Rockstar Games para la consola PlayStation 5.",
  },
  {
    id: "ea-fc",
    nombre: "EA Sports FC 26",
    precio: 54990,
    imagen: "fc.jpg",
    alt: "EA Sports FC 26",
    categorias: "consolas",
    descripcion: "Siente el deporte rey con simulaciones realistas, físicas mejoradas y modos de juego renovados.",
  },
  {
    id: "mousepad",
    nombre: "Mousepad Monster Games USB RGB Negro",
    precio: 9990,
    imagen: "mousepad.jpg",
    alt: "Mousepad Monster Games USB RGB Negro",
    categorias: "mousepad accesorios",
    descripcion: "Superficie de tela de alta precisión con bordes iluminados por RGB personalizables mediante conexión USB.",
  },
  {
    id: "ps5",
    nombre: "Consola PlayStation 5",
    precio: 549990,
    imagen: "play.avif",
    alt: "Consola PlayStation 5",
    categorias: "consolas",
    descripcion: "Consola de nueva generación con SSD ultra rápido y soporte para resolución 4K a 120 FPS.",
  },
  {
    id: "mandoxbox",
    nombre: "Mando Inalámbrico Xbox Wireless Controller Robot White",
    precio: 69990,
    imagen: "mandoxbox.avif",
    alt: "Mando inalámbrico Xbox Robot White",
    categorias: "consolas accesorios",
    descripcion: "Control inalámbrico ergonómico con agarre texturizado y conectividad Bluetooth para PC y consola.",
  },
  {
    id: "gabinetegamer",
    nombre: "Gabinete Gamer Mid-Tower RGB Vidrio Templado",
    precio: 45990,
    imagen: "gabinete.webp",
    alt: "Gabinete Gamer Mid-Tower RGB",
    categorias: "computadores-gamers",
    descripcion: "Chasis ATX con panel lateral de vidrio templado e iluminación RGB con excelente flujo de aire.",
  },
  {
    id: "pcGamerVibora",
    nombre: "Pc Gamer Vibora Black V2 AMD Ryzen 5 5600GT",
    precio: 589990,
    imagen: "pc.webp",
    alt: "PC Gamer Vibora Black V2",
    categorias: "computadores-gamers",
    descripcion: "Equipo de escritorio equipado con procesador AMD Ryzen 5 5600GT y gráficos Radeon Vega 7 integrados.",
  },
  {
    id: "notebookAsus",
    nombre: "Notebook Asus Intel Core i5 12GB SSD Azul Marino",
    precio: 499990,
    imagen: "note.png",
    alt: "Notebook Asus Intel Core i5",
    categorias: "computadores-gamers",
    descripcion: "Laptop ultraportátil con procesador Intel Core i5, 12GB de memoria RAM y SSD rápido en acabado azul marino.",
  },
  {
    id: "monitorGamer",
    nombre: "Monitor Gamer 24\" FHD 165Hz 1ms IPS",
    precio: 119990,
    imagen: "monitor.jpg",
    alt: "Monitor Gamer 24 pulgadas",
    categorias: "computadores-gamers",
    descripcion: "Pantalla Full HD con tasa de refresco de 165Hz y 1ms de respuesta, ideal para una experiencia fluida e inmersiva.",
  },
];

/* ---------- Funciones internas ---------- */

function guardar(productos) {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

function leer() {
  try {
    const guardados = localStorage.getItem(CLAVE);
    if (guardados) return JSON.parse(guardados);
  } catch (error) {
    // si el JSON está dañado, se parte de nuevo con los datos iniciales
  }

  const copia = PRODUCTOS_INICIALES.map((producto) => ({ ...producto }));
  guardar(copia);
  return copia;
}

/* ---------- CRUD ---------- */

// LEER: todos los productos
export function obtenerProductos() {
  return leer();
}

// LEER: un producto por su id (devuelve undefined si no existe)
export function obtenerProductoPorId(id) {
  return leer().find((producto) => producto.id === id);
}

// CREAR: agrega un producto nuevo. Devuelve el producto creado,
// o null si falta el id o ya existe uno igual.
export function crearProducto(datos) {
  if (!datos || !datos.id) return null;

  const productos = leer();
  if (productos.some((producto) => producto.id === datos.id)) return null;

  const nuevo = { ...datos };
  productos.push(nuevo);
  guardar(productos);
  return nuevo;
}

// ACTUALIZAR: cambia los campos indicados. Devuelve el producto
// actualizado, o null si el id no existe.
export function actualizarProducto(id, cambios) {
  const productos = leer();
  const posicion = productos.findIndex((producto) => producto.id === id);
  if (posicion === -1) return null;

  // el id no se puede cambiar
  productos[posicion] = { ...productos[posicion], ...cambios, id };
  guardar(productos);
  return productos[posicion];
}

// ELIMINAR: borra un producto. Devuelve true si lo borró, false si no existía.
export function eliminarProducto(id) {
  const productos = leer();
  const restantes = productos.filter((producto) => producto.id !== id);
  if (restantes.length === productos.length) return false;

  guardar(restantes);
  return true;
}

// Vuelve a los datos iniciales (útil para pruebas y demostraciones)
export function restablecerProductos() {
  localStorage.removeItem(CLAVE);
  return leer();
}