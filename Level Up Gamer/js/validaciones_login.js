// VALIDAR REGISTRO
function validarRegistro(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass1 = document.getElementById("pass1").value;
  const pass2 = document.getElementById("pass2").value;
  const terminos = document.getElementById("terminos").checked;

  if (nombre === "" || nombre.length < 3) {
    alert("Por favor, ingresa tu nombre completo (mínimo 3 caracteres).");
    return;
  }

  if (email === "" || !email.includes("@") || !email.includes(".")) {
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
  }

  if (pass1 === "" || pass1.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
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

  if (pass === "" || pass.length < 6) {
    alert("Ingresa tu contraseña (mínimo 6 caracteres).");
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
    window.location.href = "inicio.html";
  });
}