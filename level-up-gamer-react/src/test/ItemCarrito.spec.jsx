import { render, screen, fireEvent } from "@testing-library/react";
import ItemCarrito from "../components/ItemCarrito.jsx";
import { LevelUp } from "../services/tienda.js";
import { describe, it, expect, beforeEach, vi } from "vitest";

const PRODUCTO = {
  id: "juego-a",
  nombre: "Juego A",
  variante: "PS5",
  precio: 10000,
  cantidad: 2,
  img: "img/producto-1.jpg",
};

describe("ItemCarrito", () => {
  let onCambiarCantidad;
  let onEliminar;

  beforeEach(() => {
    onCambiarCantidad = vi.fn();
    onEliminar = vi.fn();

    render(
      <ItemCarrito
        item={PRODUCTO}
        onCambiarCantidad={onCambiarCantidad}
        onEliminar={onEliminar}
      />
    );
  });

  // ---- Props: muestra los datos que recibe ----
  it("muestra nombre, variante y cantidad recibidos por props", () => {
    expect(screen.getByText("Juego A")).toBeTruthy();
    expect(screen.getByText("PS5")).toBeTruthy();
    expect(document.querySelector(".qty-stepper span").textContent).toBe("2");
  });

  it("muestra el precio multiplicado por la cantidad", () => {
    expect(document.querySelector(".precio").textContent).toBe(LevelUp.formatCLP(20000));
  });

  it("agrega '/' al inicio de la ruta de la imagen si no lo trae", () => {
    expect(screen.getByAltText("Juego A").getAttribute("src")).toBe("/img/producto-1.jpg");
  });

  // ---- Eventos: avisa al padre con los datos correctos ----
  it("al hacer clic en '+' llama a onCambiarCantidad con (id, 1)", () => {
    fireEvent.click(screen.getByLabelText("Aumentar cantidad de Juego A"));
    expect(onCambiarCantidad).toHaveBeenCalledWith("juego-a", 1);
  });

  it("al hacer clic en '-' llama a onCambiarCantidad con (id, -1)", () => {
    fireEvent.click(screen.getByLabelText("Disminuir cantidad de Juego A"));
    expect(onCambiarCantidad).toHaveBeenCalledWith("juego-a", -1);
  });

  it("al hacer clic en el tacho llama a onEliminar con el id", () => {
    fireEvent.click(screen.getByLabelText("Eliminar Juego A"));
    expect(onEliminar).toHaveBeenCalledWith("juego-a");
  });
});