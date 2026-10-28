import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restablecerProductos,
} from "../data/productos.js";

const TOTAL_INICIAL = 13;

const NUEVO = {
  id: "silla-gamer",
  nombre: "Silla Gamer Pro",
  precio: 129990,
  imagen: "silla.jpg",
  alt: "Silla Gamer Pro",
  categorias: "sillas-gamer",
  descripcion: "Silla ergonómica reclinable.",
};

describe("productos.js (CRUD)", () => {
  // Cada prueba parte desde cero, sin datos guardados
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ---- LEER ----
  describe("leer", () => {
    it("devuelve los productos iniciales cuando no hay nada guardado", () => {
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL);
    });

    it("guarda los productos iniciales en localStorage la primera vez", () => {
      obtenerProductos();
      expect(localStorage.getItem("lug_productos")).not.toBeNull();
    });

    it("encuentra un producto por su id", () => {
      const producto = obtenerProductoPorId("mando");
      expect(producto.nombre).toBe("Mando DualSense PS5");
      expect(producto.precio).toBe(64990);
    });

    it("devuelve undefined si el id no existe", () => {
      expect(obtenerProductoPorId("no-existe")).toBeUndefined();
    });

    it("si el JSON guardado está dañado, parte de nuevo con los iniciales", () => {
      localStorage.setItem("lug_productos", "{esto no es json");
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL);
    });
  });

  // ---- CREAR ----
  describe("crear", () => {
    it("agrega un producto nuevo y lo deja guardado", () => {
      const creado = crearProducto(NUEVO);

      expect(creado.id).toBe("silla-gamer");
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL + 1);
      expect(obtenerProductoPorId("silla-gamer").nombre).toBe("Silla Gamer Pro");
    });

    it("no permite crear un producto con un id que ya existe", () => {
      const resultado = crearProducto({ ...NUEVO, id: "mando" });

      expect(resultado).toBeNull();
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL);
    });

    it("no permite crear un producto sin id", () => {
      expect(crearProducto({ nombre: "Sin id" })).toBeNull();
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL);
    });
  });

  // ---- ACTUALIZAR ----
  describe("actualizar", () => {
    it("cambia solo los campos indicados y lo deja guardado", () => {
      const actualizado = actualizarProducto("mando", { precio: 59990 });

      expect(actualizado.precio).toBe(59990);
      expect(actualizado.nombre).toBe("Mando DualSense PS5"); // no cambió
      expect(obtenerProductoPorId("mando").precio).toBe(59990);
    });

    it("no permite cambiar el id del producto", () => {
      actualizarProducto("mando", { id: "otro-id" });

      expect(obtenerProductoPorId("mando")).toBeDefined();
      expect(obtenerProductoPorId("otro-id")).toBeUndefined();
    });

    it("devuelve null si el producto no existe", () => {
      expect(actualizarProducto("no-existe", { precio: 1 })).toBeNull();
    });
  });

  // ---- ELIMINAR ----
  describe("eliminar", () => {
    it("borra el producto y devuelve true", () => {
      expect(eliminarProducto("mando")).toBe(true);
      expect(obtenerProductoPorId("mando")).toBeUndefined();
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL - 1);
    });

    it("devuelve false si el producto no existe", () => {
      expect(eliminarProducto("no-existe")).toBe(false);
      expect(obtenerProductos().length).toBe(TOTAL_INICIAL);
    });
  });

  // ---- RESTABLECER ----
  it("restablecerProductos vuelve a los datos iniciales", () => {
    eliminarProducto("mando");
    crearProducto(NUEVO);

    const productos = restablecerProductos();

    expect(productos.length).toBe(TOTAL_INICIAL);
    expect(obtenerProductoPorId("mando")).toBeDefined();
    expect(obtenerProductoPorId("silla-gamer")).toBeUndefined();
  });
});