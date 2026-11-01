// Pruebas del componente BarraBusqueda: muestra lupa, placeholder y valor recibidos por props, y avisa al padre el texto escrito (no el evento).
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import BarraBusqueda from "../components/BarraBusqueda.jsx";

const campo = () => screen.getByRole("textbox");
const escribir = (texto) => fireEvent.change(campo(), { target: { value: texto } });

describe("BarraBusqueda", () => {
  // ---- Props: lo que dibuja ----
  describe("props", () => {
    it("muestra el ícono de lupa", () => {
      render(<BarraBusqueda valor="" onCambiar={() => {}} />);

      expect(screen.getByText("🔍")).toBeTruthy();
    });

    it("muestra el placeholder y el valor recibidos", () => {
      render(
        <BarraBusqueda valor="zelda" onCambiar={() => {}} placeholder="Buscar juego, consola o accesorio..." />
      );

      expect(campo().value).toBe("zelda");
      expect(screen.getByPlaceholderText("Buscar juego, consola o accesorio...")).toBeTruthy();
    });

    it("si no se indica placeholder usa 'Buscar...'", () => {
      render(<BarraBusqueda valor="" onCambiar={() => {}} />);

      expect(campo().getAttribute("placeholder")).toBe("Buscar...");
    });

    it("usa las clases de estilo del proyecto y un aria-label para accesibilidad", () => {
      const { container } = render(<BarraBusqueda valor="" onCambiar={() => {}} placeholder="Buscar producto" />);

      expect(container.querySelector(".grupo-campo-busqueda")).not.toBeNull();
      expect(container.querySelector(".icono-busqueda")).not.toBeNull();
      expect(campo().classList.contains("campo-busqueda")).toBe(true);
      expect(campo().getAttribute("aria-label")).toBe("Buscar producto");
    });

    it("cuando cambia la prop 'valor' se actualiza lo que se ve en el campo", () => {
      const { rerender } = render(<BarraBusqueda valor="mando" onCambiar={() => {}} />);
      expect(campo().value).toBe("mando");

      rerender(<BarraBusqueda valor="teclado" onCambiar={() => {}} />);

      expect(campo().value).toBe("teclado");
    });
  });

  // ---- Eventos: avisa al padre ----
  describe("eventos", () => {
    it("al escribir llama a onCambiar con el texto escrito, no con el evento", () => {
      const onCambiar = vi.fn();
      render(<BarraBusqueda valor="" onCambiar={onCambiar} />);

      escribir("zelda");

      expect(onCambiar).toHaveBeenCalledTimes(1);
      expect(onCambiar).toHaveBeenCalledWith("zelda");
    });

    it("al borrar el texto avisa con un texto vacío", () => {
      const onCambiar = vi.fn();
      render(<BarraBusqueda valor="zelda" onCambiar={onCambiar} />);

      escribir("");

      expect(onCambiar).toHaveBeenCalledWith("");
    });

    it("por sí solo no cambia el texto mostrado: el valor lo decide el padre", () => {
      render(<BarraBusqueda valor="" onCambiar={() => {}} />);

      escribir("zelda");

      expect(campo().value).toBe("");
    });
  });

  // ---- Integración con el estado del padre (como en Catalogo.jsx) ----
  it("con el estado de un padre, escribir filtra una lista y borrar la restaura", () => {
    function Padre() {
      const [texto, setTexto] = useState("");
      const nombres = ["Mando", "Teclado", "Mouse"].filter((nombre) =>
        nombre.toLowerCase().includes(texto.trim().toLowerCase())
      );

      return (
        <>
          <BarraBusqueda valor={texto} onCambiar={setTexto} />
          <ul>
            {nombres.map((nombre) => (
              <li key={nombre}>{nombre}</li>
            ))}
          </ul>
        </>
      );
    }
    const itemsMostrados = () => screen.getAllByRole("listitem").map((el) => el.textContent);
    render(<Padre />);
    expect(itemsMostrados()).toEqual(["Mando", "Teclado", "Mouse"]);

    escribir("tecla");
    expect(itemsMostrados()).toEqual(["Teclado"]);

    escribir("");
    expect(itemsMostrados()).toEqual(["Mando", "Teclado", "Mouse"]);
  });
});