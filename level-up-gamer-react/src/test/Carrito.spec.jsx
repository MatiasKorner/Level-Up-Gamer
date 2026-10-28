import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Carrito from "../pages/Carrito.jsx";
import { LevelUp } from "../services/tienda.js";

// Datos de prueba: 1 unidad de A + 2 unidades de B = 3 unidades en total
const PRODUCTOS = [
  { id: "juego-a", nombre: "Juego A", variante: "PS5", precio: 10000, cantidad: 1, img: "img/producto-1.jpg" },
  { id: "juego-b", nombre: "Juego B", variante: "PC", precio: 5000, cantidad: 2, img: "img/producto-2.jpg" },
];

function renderizarCarrito() {
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );
}

describe("Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    // LevelUp.toast() deja un contenedor en el body; se limpia entre pruebas
    document.getElementById("lug-toast-container")?.remove();
  });

  // ---- Pruebas de renderizado ----
  describe("renderizado", () => {
    it("muestra todos los productos guardados en el carrito", () => {
      localStorage.setItem("lug_cart", JSON.stringify(PRODUCTOS));

      renderizarCarrito();

      expect(screen.getByText("Juego A")).toBeTruthy();
      expect(screen.getByText("Juego B")).toBeTruthy();
      expect(document.querySelectorAll(".cart-item").length).toBe(PRODUCTOS.length);
    });

    it("muestra la cantidad total de unidades en el subtítulo", () => {
      localStorage.setItem("lug_cart", JSON.stringify(PRODUCTOS));

      renderizarCarrito();

      expect(document.getElementById("carrito-subtitulo").textContent).toContain("3 productos");
    });
  });

  // ---- Pruebas de renderizado condicional ----
  describe("renderizado condicional", () => {
    it("con el carrito vacío muestra el mensaje y oculta el resumen de compra", () => {
      renderizarCarrito();

      expect(document.getElementById("carrito-vacio")).not.toBeNull();
      expect(document.getElementById("carrito-con-items")).toBeNull();
      expect(document.getElementById("btn-proceder")).toBeNull();
    });

    it("con productos oculta el mensaje de vacío y muestra el botón de pago", () => {
      localStorage.setItem("lug_cart", JSON.stringify(PRODUCTOS));

      renderizarCarrito();

      expect(document.getElementById("carrito-vacio")).toBeNull();
      expect(document.getElementById("btn-proceder")).not.toBeNull();
    });
  });

  // ---- Pruebas de eventos y estado ----
  describe("eventos", () => {
    it("al hacer clic en '+' aumenta la cantidad y actualiza el total", () => {
      localStorage.setItem("lug_cart", JSON.stringify(PRODUCTOS));
      renderizarCarrito();

      fireEvent.click(screen.getByLabelText("Aumentar cantidad de Juego A"));

      // estado de la UI
      const itemA = document.querySelector('.cart-item[data-id="juego-a"]');
      expect(itemA.querySelector(".qty-stepper span").textContent).toBe("2");

      // persistencia en localStorage
      const guardado = LevelUp.Carrito.obtenerItems().find((i) => i.id === "juego-a");
      expect(guardado.cantidad).toBe(2);

      // total: 2 x 10.000 + 2 x 5.000 = 30.000
      const total = document.querySelector(".summary-row.total").textContent;
      expect(total).toContain(LevelUp.formatCLP(30000));
    });

    it("al hacer clic en 'Disminuir' con cantidad 1 elimina el producto", () => {
      localStorage.setItem("lug_cart", JSON.stringify(PRODUCTOS));
      renderizarCarrito();

      fireEvent.click(screen.getByLabelText("Disminuir cantidad de Juego A"));

      expect(screen.queryByText("Juego A")).toBeNull();
      expect(screen.getByText("Juego B")).toBeTruthy();
      expect(LevelUp.Carrito.obtenerItems().length).toBe(1);
    });

    it("al hacer clic en el tacho elimina el producto y deja el carrito vacío", () => {
      localStorage.setItem("lug_cart", JSON.stringify([PRODUCTOS[0]]));
      renderizarCarrito();

      fireEvent.click(screen.getByLabelText("Eliminar Juego A"));

      expect(document.querySelectorAll(".cart-item").length).toBe(0);
      expect(document.getElementById("carrito-vacio")).not.toBeNull();
    });
  });
});
