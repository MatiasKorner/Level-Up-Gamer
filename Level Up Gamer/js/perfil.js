/* perfil.js — Lógica de la página perfil.html (09) */

document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("editar-nombre");
  const correoInput = document.getElementById("editar-correo");
  const telefonoInput = document.getElementById("editar-telefono");

  function render() {
    const u = LevelUp.Usuario.obtener();
    document.getElementById("perfil-nombre").textContent = u.nombre;
    document.getElementById("perfil-correo").textContent = u.correo;
    document.getElementById("perfil-badge-nivel").textContent = `Gamer Pro Niv. ${u.nivel}`;
    document.getElementById("stat-nivel").textContent = u.nivel;
    document.getElementById("stat-puntos").textContent = u.puntos.toLocaleString("es-CL");
    document.getElementById("stat-pedidos").textContent = u.pedidosRealizados;
    document.getElementById("menu-puntos-detalle").textContent = `${u.puntos.toLocaleString("es-CL")} puntos disponibles`;
    document.getElementById("menu-pedidos-detalle").textContent = `${u.pedidosRealizados} pedidos realizados`;

    nombreInput.value = u.nombre;
    correoInput.value = u.correo;
    telefonoInput.value = u.telefono;
  }

  document.getElementById("form-editar-perfil").addEventListener("submit", (e) => {
    e.preventDefault();

    const valido = LevelUp.Validar.validarFormulario([
      {
        input: nombreInput,
        pruebas: [
          { test: LevelUp.Validar.requerido, mensaje: "Ingresa tu nombre de usuario." },
          { test: LevelUp.Validar.minLargo(3), mensaje: "Debe tener al menos 3 caracteres." },
        ],
      },
      {
        input: correoInput,
        pruebas: [
          { test: LevelUp.Validar.requerido, mensaje: "Ingresa tu correo." },
          { test: LevelUp.Validar.email, mensaje: "Correo electrónico no válido." },
        ],
      },
      {
        input: telefonoInput,
        pruebas: [
          { test: LevelUp.Validar.requerido, mensaje: "Ingresa tu teléfono." },
          { test: LevelUp.Validar.telefonoCL, mensaje: "Formato esperado: +56 9 xxxx xxxx." },
        ],
      },
    ]);

    if (!valido) return;

    LevelUp.Usuario.actualizar({
      nombre: nombreInput.value.trim(),
      correo: correoInput.value.trim(),
      telefono: telefonoInput.value.trim(),
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-editar-perfil")).hide();
    LevelUp.toast("Perfil actualizado correctamente");
    render();
  });

  document.querySelectorAll("[data-proximamente]").forEach((btn) =>
    btn.addEventListener("click", () => LevelUp.toast(`${btn.dataset.proximamente}: próximamente disponible`))
  );

  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    if (confirm("¿Cerrar sesión?")) {
      window.location.href = "login.html";
    }
  });

  render();
});
