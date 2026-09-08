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
    precio: "$89.990 CLP",
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
  },
  ps5: {
  titulo: "Consola PlayStation 5 Edición Digital",
  precio: "$549.990 CLP",
  imagen: "img/play.avif",
  descripcion: "Consola de nueva generación con SSD ultra rápido y soporte para resolución 4K a 120 FPS."
  },
  mandoxbox: {
  titulo: "Mando Inalámbrico Xbox Wireless Controller Robot White",
  precio: "$69.990 CLP",
  imagen: "img/mandoxbox.avif",
  descripcion: "Control inalámbrico ergonómico con agarre texturizado y conectividad Bluetooth para PC y consola."
  },
  gabinetegamer: {
  titulo: "Gabinete Gamer Mid-Tower RGB Vidrio Templado",
  precio: "$45.990 CLP",
  imagen: "img/gabinete.webp",
  descripcion: "Chasis ATX con panel lateral de vidrio templado e iluminación RGB con excelente flujo de aire."
  },
 pcGamerVibora: {
  titulo: "PC Gamer Víbora Black V2 AMD Ryzen 5 5600GT",
  precio: "$429.990 CLP",
  imagen: "img/pc.webp",
  descripcion: "Equipo de escritorio equipado con procesador AMD Ryzen 5 5600GT y gráficos Radeon Vega 7 integrados."
  },
notebookAsus: {
  titulo: "Notebook Asus Intel Core i5 12GB SSD Azul Marino",
  precio: "$499.990 CLP",
  imagen: "img/note.png",
  descripcion: "Laptop ultraportátil con procesador Intel Core i5, 12GB de memoria RAM y SSD rápido en acabado azul marino."
},
monitorGamer: {
  titulo: "Monitor Gamer 24\" FHD 165Hz 1ms IPS",
  precio: "$129.990 CLP",
  imagen: "img/monitor.jpg",
  descripcion: "Pantalla Full HD con tasa de refresco de 165Hz y 1ms de respuesta, ideal para una experiencia fluida e inmersiva."
}


};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productoId = params.get('id');

  const tituloEl = document.getElementById('detalle-titulo');
  const precioEl = document.getElementById('detalle-precio');
  const descEl = document.getElementById('detalle-descripcion');
  const imgEl = document.getElementById('detalle-imagen');
  const cantidadEl = document.getElementById('cantidad');
  const btnAgregar = document.getElementById('btn-agregar-carrito');

  if (productoId && productos[productoId]) {
    const item = productos[productoId];
    if (imgEl) {
      imgEl.src = item.imagen;
      imgEl.alt = item.titulo;
    }
    if (tituloEl) tituloEl.textContent = item.titulo;
    if (precioEl) precioEl.textContent = item.precio;
    if (descEl) descEl.textContent = item.descripcion;
    if (btnAgregar) {
  btnAgregar.addEventListener('click', () => {
    const cantidad = cantidadEl ? parseInt(cantidadEl.value) || 1 : 1;

    LevelUp.Carrito.agregar({
      id: productoId,
      nombre: item.titulo,
      variante: "Unidad",
      precio: parseInt(item.precio.replace(/\D/g, "")),
      cantidad: cantidad,
      img: item.imagen
    });

    const contador = document.getElementById("cart-count-badge");

    if (contador) {
      contador.textContent = LevelUp.Carrito.contarUnidades();
    }

    LevelUp.toast(item.titulo + " agregado al carrito");
  });
}
  } else {
    if (tituloEl) tituloEl.textContent = "Producto no encontrado";
    if (descEl) descEl.textContent = "El ID especificado en la URL (" + productoId + ") no está registrado en el sistema.";
  }
});