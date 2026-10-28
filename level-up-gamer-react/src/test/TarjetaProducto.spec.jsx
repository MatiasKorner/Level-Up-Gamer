import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

const PRODUCTO = {
  id: "mando",
  nombre: "Mando DualSense PS5",
  precio: 64990,
  imagen: "mando.jpg",
  alt: "Mando DualSense PS5 blanco",
  categorias: "consolas accesorios",
};

// La tarjeta usa <Link>, que necesita estar dentro de un Router
function renderizarTarjeta(producto = PRODUCTO) {
  return render(
    <MemoryRouter initialEntries={["/catalogo"]}>
      <Routes>
        <Route path="/catalogo" element={<TarjetaProducto producto={producto} />} />
        <Route path="/detalle" element={<p>Pantalla de detalle</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("TarjetaProducto", () => {
  // ---- Props: muestra los datos recibidos ----
  it("muestra el nombre del producto", () => {
    renderizarTarjeta();
    expect(screen.getByText("Mando DualSense PS5")).toBeTruthy();
  });

  it("muestra el precio con el formato de la tienda", () => {
    renderizarTarjeta();
    const esperado = `$${PRODUCTO.precio.toLocaleString("es-CL")} CLP`;
    expect(document.querySelector(".precio-tarjeta").textContent).toBe(esperado);
  });

  it("muestra la imagen desde /img con su texto alternativo", () => {
    renderizarTarjeta();
    const imagen = screen.getByAltText("Mando DualSense PS5 blanco");
    expect(imagen.getAttribute("src")).toBe("/img/mando.jpg");
  });

  it("guarda las categorías en data-categoria", () => {
    renderizarTarjeta();
    expect(document.querySelector(".tarjeta").dataset.categoria).toBe("consolas accesorios");
  });

  // ---- Enlace ----
  it("el enlace 'Ver Detalle' apunta a /detalle con el id del producto", () => {
    renderizarTarjeta();
    const enlace = screen.getByText("Ver Detalle");
    expect(enlace.getAttribute("href")).toBe("/detalle?id=mando");
  });

  it("codifica el id si trae caracteres especiales", () => {
    renderizarTarjeta({ ...PRODUCTO, id: "ea fc" });
    expect(screen.getByText("Ver Detalle").getAttribute("href")).toBe("/detalle?id=ea%20fc");
  });

  // ---- Evento: navegación ----
  it("al hacer clic en 'Ver Detalle' navega a la pantalla de detalle", () => {
    renderizarTarjeta();
    fireEvent.click(screen.getByText("Ver Detalle"));
    expect(screen.getByText("Pantalla de detalle")).toBeTruthy();
    expect(screen.queryByText("Mando DualSense PS5")).toBeNull();
  });
});