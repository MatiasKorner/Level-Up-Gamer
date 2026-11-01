// Pruebas del componente FiltroCategorias: dibuja un botón por categoría, marca la activa según sus props y avisa al padre cuál se eligió.
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import FiltroCategorias from "../components/FiltroCategorias.jsx";

const CATEGORIAS = [
  { valor: "tendencias", texto: "Tendencias" },
  { valor: "consolas", texto: "Consolas" },
  { valor: "pc", texto: "PC" },
];

const boton = (nombre) => screen.getByRole("button", { name: nombre });

describe("FiltroCategorias", () => {
  // ---- Props: dibuja lo que recibe ----
  describe("props", () => {
    it("dibuja un botón por cada categoría con su texto", () => {
      render(<FiltroCategorias categorias={CATEGORIAS} activa="tendencias" onSeleccionar={() => {}} />);

      const textos = screen.getAllByRole("button").map((el) => el.textContent);
      expect(textos).toEqual(["Tendencias", "Consolas", "PC"]);
    });

    it("sin categorías no dibuja ningún botón", () => {
      render(<FiltroCategorias onSeleccionar={() => {}} />);

      expect(screen.queryAllByRole("button").length).toBe(0);
    });

    it("marca como activa solo la categoría recibida en 'activa'", () => {
      render(<FiltroCategorias categorias={CATEGORIAS} activa="consolas" onSeleccionar={() => {}} />);

      // el botón activo es el que NO tiene la clase "boton-borde"
      expect(boton("Consolas").classList.contains("boton-borde")).toBe(false);
      expect(boton("Consolas").getAttribute("aria-pressed")).toBe("true");

      expect(boton("Tendencias").classList.contains("boton-borde")).toBe(true);
      expect(boton("Tendencias").getAttribute("aria-pressed")).toBe("false");
      expect(boton("PC").classList.contains("boton-borde")).toBe(true);
    });

    it("cuando cambia la prop 'activa' cambia el botón marcado", () => {
      const { rerender } = render(
        <FiltroCategorias categorias={CATEGORIAS} activa="tendencias" onSeleccionar={() => {}} />
      );
      expect(boton("Tendencias").getAttribute("aria-pressed")).toBe("true");

      rerender(<FiltroCategorias categorias={CATEGORIAS} activa="pc" onSeleccionar={() => {}} />);

      expect(boton("PC").getAttribute("aria-pressed")).toBe("true");
      expect(boton("Tendencias").getAttribute("aria-pressed")).toBe("false");
    });
  });

  // ---- Eventos: avisa al padre con el dato correcto ----
  describe("eventos", () => {
    it("al hacer clic en un botón llama a onSeleccionar con el valor de esa categoría", () => {
      const onSeleccionar = vi.fn();
      render(<FiltroCategorias categorias={CATEGORIAS} activa="tendencias" onSeleccionar={onSeleccionar} />);

      fireEvent.click(boton("Consolas"));

      expect(onSeleccionar).toHaveBeenCalledTimes(1);
      expect(onSeleccionar).toHaveBeenCalledWith("consolas");
    });

    it("por sí solo no cambia la categoría activa: eso lo decide el padre", () => {
      render(<FiltroCategorias categorias={CATEGORIAS} activa="tendencias" onSeleccionar={() => {}} />);

      fireEvent.click(boton("PC"));

      expect(boton("Tendencias").getAttribute("aria-pressed")).toBe("true");
      expect(boton("PC").getAttribute("aria-pressed")).toBe("false");
    });
  });

  // ---- Integración con el estado del padre (como en Inicio.jsx) ----
  it("funcionando con el estado de un padre, el botón elegido pasa a ser el activo", () => {
    function Padre() {
      const [categoria, setCategoria] = useState("tendencias");
      return <FiltroCategorias categorias={CATEGORIAS} activa={categoria} onSeleccionar={setCategoria} />;
    }
    render(<Padre />);

    fireEvent.click(boton("Consolas"));

    expect(boton("Consolas").getAttribute("aria-pressed")).toBe("true");
    expect(boton("Tendencias").getAttribute("aria-pressed")).toBe("false");
  });
});