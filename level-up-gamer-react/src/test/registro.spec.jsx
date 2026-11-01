// Pruebas del componente CampoFormulario: dibuja ícono, tipo, id, placeholder y valor recibidos por props, y avisa al padre cada vez que se escribe.
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import CampoFormulario from "../components/CampoFormulario.jsx";

const PROPS = {
  icono: "👤",
  id: "nombre",
  placeholder: "Nombre completo",
  valor: "",
  onChange: () => {},
};

const campo = (placeholder = "Nombre completo") => screen.getByPlaceholderText(placeholder);

describe("CampoFormulario", () => {
  // ---- Props: lo que dibuja ----
  describe("props", () => {
    it("muestra el ícono recibido", () => {
      render(<CampoFormulario {...PROPS} />);

      expect(screen.getByText("👤")).toBeTruthy();
    });

    it("muestra el placeholder y el valor recibidos", () => {
      render(<CampoFormulario {...PROPS} valor="Ana Pérez" />);

      expect(campo().value).toBe("Ana Pérez");
    });

    it("si no se indica el tipo, es un campo de texto", () => {
      render(<CampoFormulario {...PROPS} />);

      expect(campo().getAttribute("type")).toBe("text");
    });

    it.each(["email", "password"])("usa el tipo '%s' cuando se lo piden", (tipo) => {
      render(<CampoFormulario {...PROPS} tipo={tipo} />);

      expect(campo().getAttribute("type")).toBe(tipo);
    });

    it("si no se indica 'name', usa el mismo valor que 'id'", () => {
      render(<CampoFormulario {...PROPS} id="email" />);

      expect(campo().id).toBe("email");
      expect(campo().getAttribute("name")).toBe("email");
    });

    it("usa el 'name' personalizado cuando se entrega", () => {
      render(<CampoFormulario {...PROPS} id="codigo-referido" name="codigoReferido" />);

      expect(campo().id).toBe("codigo-referido");
      expect(campo().getAttribute("name")).toBe("codigoReferido");
    });

    it("aplica las clases de estilo del proyecto", () => {
      const { container } = render(<CampoFormulario {...PROPS} />);

      expect(container.querySelector(".grupo-campo")).not.toBeNull();
      expect(container.querySelector(".icono-campo")).not.toBeNull();
      expect(campo().classList.contains("campo-entrada")).toBe(true);
    });

    it("cuando cambia la prop 'valor' se actualiza lo que se ve en el campo", () => {
      const { rerender } = render(<CampoFormulario {...PROPS} valor="Ana" />);
      expect(campo().value).toBe("Ana");

      rerender(<CampoFormulario {...PROPS} valor="Luis" />);

      expect(campo().value).toBe("Luis");
    });
  });

  // ---- Eventos: avisa al padre ----
  describe("eventos", () => {
    it("al escribir llama a onChange con el evento (trae el name y el valor escrito)", () => {
      let recibido = null;
      // el dato se captura dentro del manejador: un input controlado vuelve a su valor al terminar el evento
      const onChange = vi.fn((evento) => {
        recibido = { name: evento.target.name, valor: evento.target.value };
      });
      render(<CampoFormulario {...PROPS} onChange={onChange} />);

      fireEvent.change(campo(), { target: { value: "Ana" } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(recibido).toEqual({ name: "nombre", valor: "Ana" });
    });
  });

  // ---- Integración con el estado del padre (como en RegistroUsuario.jsx) ----
  it("un mismo manejador del padre puede servir para varios campos gracias a 'name'", () => {
    function Formulario() {
      const [datos, setDatos] = useState({ nombre: "", email: "" });
      const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setDatos((anterior) => ({ ...anterior, [name]: value }));
      };

      return (
        <form>
          <CampoFormulario icono="👤" id="nombre" placeholder="Nombre completo" valor={datos.nombre} onChange={manejarCambio} />
          <CampoFormulario icono="✉️" id="email" tipo="email" placeholder="Correo electrónico" valor={datos.email} onChange={manejarCambio} />
        </form>
      );
    }
    render(<Formulario />);

    fireEvent.change(campo("Nombre completo"), { target: { value: "Ana" } });
    fireEvent.change(campo("Correo electrónico"), { target: { value: "ana@duoc.cl" } });

    expect(campo("Nombre completo").value).toBe("Ana");
    expect(campo("Correo electrónico").value).toBe("ana@duoc.cl");
  });
});