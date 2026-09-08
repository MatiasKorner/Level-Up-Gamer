const productos = {
  mando: {
    titulo: "Mando Inalámbrico DualSense PS5",
    precio: "$64.990 CLP",
    imagen: "img/mando.jpg",
    descripcion: "Siente una inmersión física en tus juegos de PS5 con la retroalimentación háptica y gatillos adaptables."
  },
  teclado: {
    titulo: "Redragon Kumara K552 RGB",
    precio: "$32.990 CLP",
    imagen: "img/teclado.webp",
    descripcion: "Teclado mecánico compacto TKL con iluminación RGB y switches mecánicos de alta durabilidad."
  },
  mouse: {
    titulo: "Mouse Logitech G305",
    precio: "$29.990 CLP",
    imagen: "img/mouse.webp",
    descripcion: "Inalámbrico con tecnología LIGHTSPEED, sensor HERO de 12.000 DPI y autonomía excepcional."
  },
  auris: {
    titulo: "Audífonos Gamer HyperX Cloud II Wireless",
    precio: "$84.990 CLP",
    imagen: "img/auris.webp",
    descripcion: "Sonido envolvente 7.1 con almohadillas viscoelásticas para máxima comodidad."
  },
  gta: {
    titulo: "Grand Theft Auto VI (PS5)",
    precio: "$69.990 CLP",
    imagen: "img/gta.webp",
    descripcion: "Reserva oficial de la próxima entrega de Rockstar Games para la consola PlayStation 5."
  },
  "ea-fc": {
    titulo: "EA Sports FC 26",
    precio: "$54.990 CLP",
    imagen: "img/fc.jpg",
    descripcion: "Siente el deporte rey con simulaciones realistas, físicas mejoradas y modos de juego renovados."
  },
  eafc: {
    titulo: "EA Sports FC 26",
    precio: "$54.990 CLP",
    imagen: "img/fc.jpg",
    descripcion: "Siente el deporte rey con simulaciones realistas, físicas mejoradas y modos de juego renovados."
  },
  mousepad: {
    titulo: "Mousepad Monster Games USB RGB Negro",
    precio: "$9.990 CLP",
    imagen: "img/mousepad.jpg",
    descripcion: "Superficie de tela de alta precisión con bordes iluminados por RGB personalizables mediante conexión USB."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productoId = params.get('id');

  const tituloEl = document.getElementById('detalle-titulo');
  const precioEl = document.getElementById('detalle-precio');
  const descEl = document.getElementById('detalle-descripcion');
  const imgEl = document.getElementById('detalle-imagen');
  const btnCarrito = document.querySelector('[data-add-to-cart]');

  if (productoId && productos[productoId]) {
    const item = productos[productoId];
    if (imgEl) {
      imgEl.src = item.imagen;
      imgEl.alt = item.titulo;
    }
    if (tituloEl) tituloEl.textContent = item.titulo;
    if (precioEl) precioEl.textContent = item.precio;
    if (descEl) descEl.textContent = item.descripcion;

    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => {
        if (typeof LevelUp === 'undefined') {
          alert('No se pudo cargar el carrito.');
          return;
        }
        const precioNumero = Number(item.precio.replace(/[^0-9]/g, ''));
        LevelUp.Carrito.agregar({
          id: productoId,
          nombre: item.titulo,
          variante: 'Unidad',
          precio: precioNumero,
          cantidad: 1,
          img: item.imagen
        });
        LevelUp.toast(item.titulo + ' agregado al carrito');
        const badge = document.getElementById('cart-count-badge');
        if (badge) badge.textContent = LevelUp.Carrito.contarUnidades();
      });
    }
  } else {
    if (tituloEl) tituloEl.textContent = "Producto no encontrado";
    if (descEl) descEl.textContent = "El ID especificado en la URL (" + productoId + ") no está registrado en el sistema.";
  }
});