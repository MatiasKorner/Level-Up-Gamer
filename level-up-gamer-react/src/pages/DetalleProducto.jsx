
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LevelUp } from '../services/tienda.js';

import "../css/base.css";
import "../css/componentes.css";
import "../css/inicio.css";
import "../css/detalle.css";


const productos = {
  mando: {
    titulo: 'Mando Inalámbrico DualSense PS5',
    precio: 64990,
    imagen: '/img/mando.jpg',
    descripcion:
      'Siente una inmersión física en tus juegos de PS5 con la retroalimentación háptica y gatillos adaptables.',
  },
  teclado: {
    titulo: 'Redragon Kumara K552 RGB',
    precio: 32990,
    imagen: '/img/teclado.webp',
    descripcion:
      'Teclado mecánico compacto TKL con iluminación RGB y switches mecánicos de alta durabilidad.',
  },
  mouse: {
    titulo: 'Mouse Logitech G305',
    precio: 29990,
    imagen: '/img/mouse.webp',
    descripcion:
      'Inalámbrico con tecnología LIGHTSPEED, sensor HERO de 12.000 DPI y autonomía excepcional.',
  },
  auris: {
    titulo: 'Audífonos Gamer HyperX Cloud II Wireless',
    precio: 89990,
    imagen: '/img/auris.webp',
    descripcion:
      'Sonido envolvente 7.1 con almohadillas viscoelásticas para máxima comodidad.',
  },
  gta: {
    titulo: 'Grand Theft Auto VI (PS5)',
    precio: 69990,
    imagen: '/img/gta.webp',
    descripcion:
      'Reserva oficial de la próxima entrega de Rockstar Games para la consola PlayStation 5.',
  },
  'ea-fc': {
    titulo: 'EA Sports FC 26',
    precio: 54990,
    imagen: '/img/fc.jpg',
    descripcion:
      'Siente el deporte rey con simulaciones realistas, físicas mejoradas y modos de juego renovados.',
  },
  eafc: {
    titulo: 'EA Sports FC 26',
    precio: 54990,
    imagen: '/img/fc.jpg',
    descripcion:
      'Siente el deporte rey con simulaciones realistas, físicas mejoradas y modos de juego renovados.',
  },
  mousepad: {
    titulo: 'Mousepad Monster Games USB RGB Negro',
    precio: 9990,
    imagen: '/img/mousepad.jpg',
    descripcion:
      'Superficie de tela de alta precisión con bordes iluminados por RGB personalizables mediante conexión USB.',
  },
  ps5: {
    titulo: 'Consola PlayStation 5 Edición Digital',
    precio: 549990,
    imagen: '/img/play.avif',
    descripcion:
      'Consola de nueva generación con SSD ultra rápido y soporte para resolución 4K a 120 FPS.',
  },
  mandoxbox: {
    titulo: 'Mando Inalámbrico Xbox Wireless Controller Robot White',
    precio: 69990,
    imagen: '/img/mandoxbox.avif',
    descripcion:
      'Control inalámbrico ergonómico con agarre texturizado y conectividad Bluetooth para PC y consola.',
  },
  gabinetegamer: {
    titulo: 'Gabinete Gamer Mid-Tower RGB Vidrio Templado',
    precio: 45990,
    imagen: '/img/gabinete.webp',
    descripcion:
      'Chasis ATX con panel lateral de vidrio templado e iluminación RGB con excelente flujo de aire.',
  },
  pcGamerVibora: {
    titulo: 'PC Gamer Víbora Black V2 AMD Ryzen 5 5600GT',
    precio: 589990,
    imagen: '/img/pc.webp',
    descripcion:
      'Equipo de escritorio equipado con procesador AMD Ryzen 5 5600GT y gráficos Radeon Vega 7 integrados.',
  },
  notebookAsus: {
    titulo: 'Notebook Asus Intel Core i5 12GB SSD Azul Marino',
    precio: 499990,
    imagen: '/img/note.png',
    descripcion:
      'Laptop ultraportátil con procesador Intel Core i5, 12GB de memoria RAM y SSD rápido en acabado azul marino.',
  },
  monitorGamer: {
    titulo: 'Monitor Gamer 24" FHD 165Hz 1ms IPS',
    precio: 119990,
    imagen: '/img/monitor.jpg',
    descripcion:
      'Pantalla Full HD con tasa de refresco de 165Hz y 1ms de respuesta, ideal para una experiencia fluida e inmersiva.',
  },
};

export default function DetallesProducto() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productoId = searchParams.get('id');
  const producto = productos[productoId];

  const [cantidad, setCantidad] = useState(1);

  function agregarAlCarrito() {
    if (!producto) return;

    LevelUp.Carrito.agregar({
      id: productoId,
      nombre: producto.titulo,
      variante: 'Unidad',
      precio: producto.precio,
      cantidad,
      img: producto.imagen,
    });

    window.dispatchEvent(new Event('lug-cart-updated'));

    LevelUp.toast(`${producto.titulo} agregado al carrito`);
  }

  if (!producto) {
    return (
      <main className="contenedor-principal">
        <Link to="/catalogo" className="boton-volver">
          ← Volver al catálogo
        </Link>

        <div className="detalle-producto">
          <div className="info-detalle">
            <h1 id="detalle-titulo">Producto no encontrado</h1>
            <p id="detalle-descripcion">
              El ID especificado en la URL ({productoId || 'ninguno'})
              no está registrado en el sistema.
            </p>
            <Link to="/catalogo" className="boton-azul">
              Ir al catálogo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="contenedor-principal">
      {/* Botón de retorno */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="boton-volver"
      >
        ← Volver
      </button>

      <div className="detalle-producto">
        <img
          id="detalle-imagen"
          src={producto.imagen}
          alt={producto.titulo}
          className="imagen-detalle"
        />

        <div className="info-detalle">
          <h1 id="detalle-titulo">{producto.titulo}</h1>

          <p id="detalle-precio" className="precio-detalle">
            {LevelUp.formatCLP(producto.precio)}
          </p>

          <p id="detalle-descripcion">{producto.descripcion}</p>

          {/* Selector de cantidad */}
          <div className="contenedor-cantidad">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              min="1"
              max="10"
              step="1"
              onChange={(evento) => {
                const valor = Number(evento.target.value);

                if (Number.isInteger(valor) && valor >= 1 && valor <= 10) {
                  setCantidad(valor);
                }
              }}
            />
          </div>

          <button
            id="btn-agregar-carrito"
            type="button"
            className="boton-azul"
            onClick={agregarAlCarrito}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </main>
  );
}
