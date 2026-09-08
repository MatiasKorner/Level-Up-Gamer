// VALIDAR REGISTRO
function validarRegistro(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass1 = document.getElementById("pass1").value;
  const pass2 = document.getElementById("pass2").value;
  const terminos = document.getElementById("terminos").checked;
  const codigoReferido = document.getElementById("codigo-referido").value.trim();

  if (nombre === "" || nombre.length < 3) {
    alert("Por favor, ingresa tu nombre completo (mínimo 3 caracteres).");
    return;
  }

  const dominiosPermitidos = [
    "@duoc.cl",
    "@profesor.duoc.cl",
    "@gmail.com"
  ];

  const correoValido = dominiosPermitidos.some(
    dominio => email.endsWith(dominio)
  );

  if (!correoValido) {
    alert("Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com");
    return;
  }
  if (pass1.length < 4 || pass1.length >10) {
    alert("La contraseña debe tener entre 4 y 10 caracteres.");
    return;
  }

  if (pass1 !== pass2) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  if (!terminos) {
    alert("Debes aceptar los términos de servicio para continuar.");
    return;
  }

  const usuarioRegistrado = {
  nombre: nombre,
  correo: email,
  contraseña: pass1,
  telefono: "",
  nivel: 1,
  puntos: 0,
  puntosSiguienteNivel: 1000,
  pedidosRealizados: 0,
  codigoReferido: codigoReferido
};

  localStorage.setItem(
    "lug_usuario_registrado",
    JSON.stringify(usuarioRegistrado)
);

  // Alerta personalizada 
  Swal.fire({
    title: "¡CUENTA CREADA! 🎮",
    text: "Tu registro se completó exitosamente.",
    icon: "success",
    background: "#121212",
    color: "#ffffff",
    confirmButtonColor: "#1e90ff",
    iconColor: "#39ff14",
    timer: 3000,
    showConfirmButton: false
  }).then(() => {
    window.location.href = "login.html";
  });
}

// VALIDAR INICIAR SESIÓN
function validarLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("pass").value;

  if (!email.includes("@") || !email.includes(".")) {
    alert("Ingresa un correo electrónico válido.");
    return;
  }

  if (pass.length < 4 || pass.length > 10) {
    alert("La contraseña debe tener entre 4 y 10 caracteres");
    return;
  }

  // Alerta personalizada 
  Swal.fire({
    title: "¡BIENVENIDO! 👾",
    text: "Inicio de sesión exitoso.",
    icon: "success",
    background: "#121212",
    color: "#ffffff",
    confirmButtonColor: "#1e90ff",
    iconColor: "#39ff14",
    timer: 3000,
    showConfirmButton: false
  }).then(() => {
    window.location.href = "index.html";
  });
}