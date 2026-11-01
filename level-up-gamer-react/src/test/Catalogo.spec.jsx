// Pruebas de la página Catálogo: filtro por categoría, búsqueda, ordenamiento y menú de más categorías, usando un mock de los datos de productos.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../pages/Catalogo.jsx";
import { obtenerProductos } from "../data/productos.js";

// Mock del módulo de datos: el Catálogo no lee los productos reales,
// recibe los de prueba que se definen abajo
vi.mock("../data/productos.js", () => ({
  obtenerProductos: vi.fn(),
}));

// Orden original: mando, teclado, pc, mouse
const PRODUCTOS = [
  { id: "mando", nombre: "Mando DualSense PS5", precio: 64990, imagen: "mando.jpg", alt: "Mando", categorias: "consolas accesorios" },
  { id: "teclado", nombre: "Teclado Redragon Kumara", precio: 32990, imagen: "teclado.webp", alt: "Teclado", categorias: "accesorios" },
  { id: "pc", nombre: "Pc Gamer Vibora", precio: 589990, imagen: "pc.webp", alt: "PC", categorias: "computadores-gamers" },
  { id: "mouse", nombre: "Mouse Logitech G305", precio: 29990, imagen: "mouse.webp", alt: "Mouse", categorias: "mouse" },
];

const MENSAJE_SIN_RESULTADOS = "No se encontraron productos con esos criterios.";

// Las tarjetas usan <Link>, por eso el Catálogo va dentro de un Router
function renderizarCatalogo() {
  return render(
    <MemoryRouter>
      <Catalogo />
    </MemoryRouter>
  );
}

// ---- Ayudantes para no repetir código en cada prueba ----
const nombresMostrados = () =>
  Array.from(document.querySelectorAll(".titulo-tarjeta")).map((el) => el.textContent);

const boton = (nombre) => screen.getByRole("button", { name: nombre });

const buscar = (texto) =>
  fireEvent.change(screen.getByPlaceholderText(/Buscar/), { target: { value: texto } });

const ordenar = (criterio) =>
  fireEvent.change(document.querySelector(".select-orden"), { target: { value: criterio } });

describe("Catalogo", () => {
  beforeEach(() => {
    obtenerProductos.mockReturnValue(PRODUCTOS);
  });

  // ---- Renderizado inicial ----
  describe("renderizado", () => {
    it("muestra todos los productos en su orden original", () => {
      renderizarCatalogo();

      expect(nombresMostrados()).toEqual([
        "Mando DualSense PS5",
        "Teclado Redragon Kumara",
        "Pc Gamer Vibora",
        "Mouse Logitech G305",
      ]);
      expect(screen.queryByText(MENSAJE_SIN_RESULTADOS)).toBeNull();
    });

    it("lee los productos de la fuente de datos una sola vez, aunque cambie el estado", () => {
      renderizarCatalogo();

      buscar("mando");
      fireEvent.click(boton("Consolas"));

      expect(obtenerProductos).toHaveBeenCalledTimes(1);
    });
  });

  // ---- Filtro por categoría ----
  describe("filtro por categoría", () => {
    it("al elegir 'Consolas' muestra solo los productos de esa categoría", () => {
      renderizarCatalogo();

      fireEvent.click(boton("Consolas"));

      expect(nombresMostrados()).toEqual(["Mando DualSense PS5"]);
    });

    it("un producto con varias categorías aparece en todas ellas", () => {
      renderizarCatalogo();

      // el mando es "consolas accesorios", así que también sale en Accesorios
      fireEvent.click(boton("Accesorios"));

      expect(nombresMostrados()).toEqual(["Mando DualSense PS5", "Teclado Redragon Kumara"]);
    });

    it("'Todos' vuelve a mostrar todos los productos", () => {
      renderizarCatalogo();
      fireEvent.click(boton("Computadores"));
      expect(nombresMostrados()).toEqual(["Pc Gamer Vibora"]);

      fireEvent.click(boton("Todos"));

      expect(nombresMostrados().length).toBe(PRODUCTOS.length);
    });

    it("marca como activo el botón de la categoría elegida", () => {
      renderizarCatalogo();
      // el botón activo es el que NO tiene la clase "boton-borde"
      expect(boton("Todos").classList.contains("boton-borde")).toBe(false);
      expect(boton("Consolas").classList.contains("boton-borde")).toBe(true);

      fireEvent.click(boton("Consolas"));

      expect(boton("Consolas").classList.contains("boton-borde")).toBe(false);
      expect(boton("Todos").classList.contains("boton-borde")).toBe(true);
    });
  });

  // ---- Búsqueda por texto ----
  describe("búsqueda", () => {
    it("busca por nombre sin importar mayúsculas ni espacios sobrantes", () => {
      renderizarCatalogo();

      buscar("  TECLADO ");

      expect(nombresMostrados()).toEqual(["Teclado Redragon Kumara"]);
    });

    it("combina la búsqueda con la categoría (deben cumplirse ambas)", () => {
      renderizarCatalogo();
      fireEvent.click(boton("Accesorios"));

      buscar("mando");
      expect(nombresMostrados()).toEqual(["Mando DualSense PS5"]);

      // el mouse existe, pero no está en la categoría Accesorios
      buscar("logitech");
      expect(nombresMostrados()).toEqual([]);
    });

    it("si no hay coincidencias muestra el mensaje de sin resultados", () => {
      renderizarCatalogo();

      buscar("zzzz");

      expect(document.querySelectorAll(".tarjeta").length).toBe(0);
      expect(screen.getByText(MENSAJE_SIN_RESULTADOS)).toBeTruthy();
    });

    it("al borrar el texto vuelven todos los productos y desaparece el mensaje", () => {
      renderizarCatalogo();
      buscar("zzzz");

      buscar("");

      expect(nombresMostrados().length).toBe(PRODUCTOS.length);
      expect(screen.queryByText(MENSAJE_SIN_RESULTADOS)).toBeNull();
    });
  });

  // ---- Ordenamiento ----
  describe("ordenamiento", () => {
    it.each([
      [
        "precio-menor",
        ["Mouse Logitech G305", "Teclado Redragon Kumara", "Mando DualSense PS5", "Pc Gamer Vibora"],
      ],
      [
        "precio-mayor",
        ["Pc Gamer Vibora", "Mando DualSense PS5", "Teclado Redragon Kumara", "Mouse Logitech G305"],
      ],
      [
        "nombre",
        ["Mando DualSense PS5", "Mouse Logitech G305", "Pc Gamer Vibora", "Teclado Redragon Kumara"],
      ],
      [
        // primera categoría de cada producto: accesorios < computadores-gamers < consolas < mouse
        "categoria",
        ["Teclado Redragon Kumara", "Pc Gamer Vibora", "Mando DualSense PS5", "Mouse Logitech G305"],
      ],
    ])("ordena por '%s'", (criterio, esperado) => {
      renderizarCatalogo();

      ordenar(criterio);

      expect(nombresMostrados()).toEqual(esperado);
    });

    it("el orden se aplica solo a los productos filtrados", () => {
      renderizarCatalogo();
      fireEvent.click(boton("Accesorios"));

      ordenar("precio-menor");

      expect(nombresMostrados()).toEqual(["Teclado Redragon Kumara", "Mando DualSense PS5"]);
    });
  });

  // ---- Menú "más categorías" (los 3 puntos) ----
  describe("menú de más categorías", () => {
    const menu = () => document.getElementById("menu-categorias");
    const botonMas = () => document.getElementById("btn-mas-categorias");

    it("se abre y se cierra con el botón de los 3 puntos", () => {
      renderizarCatalogo();
      expect(menu().classList.contains("activo")).toBe(false);
      expect(botonMas().getAttribute("aria-expanded")).toBe("false");

      fireEvent.click(botonMas());
      expect(menu().classList.contains("activo")).toBe(true);
      expect(botonMas().getAttribute("aria-expanded")).toBe("true");

      fireEvent.click(botonMas());
      expect(menu().classList.contains("activo")).toBe(false);
    });

    it("se cierra al hacer clic fuera de él", () => {
      renderizarCatalogo();
      fireEvent.click(botonMas());
      expect(menu().classList.contains("activo")).toBe(true);

      fireEvent.click(document.body);

      expect(menu().classList.contains("activo")).toBe(false);
    });

    it("al elegir una categoría adicional filtra los productos y cierra el menú", () => {
      renderizarCatalogo();
      fireEvent.click(botonMas());

      fireEvent.click(boton("Mouse"));

      expect(nombresMostrados()).toEqual(["Mouse Logitech G305"]);
      expect(menu().classList.contains("activo")).toBe(false);
    });
  });
});