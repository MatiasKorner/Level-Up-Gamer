import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";

function renderizarLogin() {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Página de inicio</p>} />
      </Routes>
    </MemoryRouter>
  );

  return document.getElementById("form-login");
}

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("muestra un error y no inicia sesión cuando la contraseña es incorrecta", () => {
    localStorage.setItem(
      "lug_usuario_registrado",
      JSON.stringify({ correo: "jugador@gmail.com", contraseña: "clave123" })
    );

    const formulario = renderizarLogin();
    const campos = within(formulario);
    const contrasena = campos.getByPlaceholderText("Contraseña");

    fireEvent.change(campos.getByPlaceholderText("Correo electrónico"), {
      target: { value: "jugador@gmail.com" },
    });
    fireEvent.change(contrasena, { target: { value: "otra123" } });
    fireEvent.click(campos.getByRole("button", { name: /iniciar sesión/i }));

    expect(campos.getByText("Correo o contraseña incorrectos")).toBeTruthy();
    expect(contrasena.classList.contains("is-invalid")).toBe(true);
    expect(localStorage.getItem("lug_user")).toBeNull();
    expect(localStorage.getItem("lug_correo")).toBeNull();
    expect(screen.queryByText("Página de inicio")).toBeNull();
    expect(document.getElementById("form-login")).toBe(formulario);
  });

  it("bloquea el envío con la validación nativa cuando los campos están vacíos", () => {
    const formulario = renderizarLogin();
    const campos = within(formulario);
    const alEnviar = vi.fn();
    formulario.addEventListener("submit", alEnviar);

    fireEvent.click(campos.getByRole("button", { name: /iniciar sesión/i }));

    expect(campos.getByPlaceholderText("Correo electrónico").validity.valueMissing).toBe(true);
    expect(campos.getByPlaceholderText("Contraseña").validity.valueMissing).toBe(true);
    expect(formulario.checkValidity()).toBe(false);
    expect(alEnviar).not.toHaveBeenCalled();
    expect(localStorage.getItem("lug_user")).toBeNull();
    expect(localStorage.getItem("lug_correo")).toBeNull();
    expect(screen.queryByText("Página de inicio")).toBeNull();
  });
});
