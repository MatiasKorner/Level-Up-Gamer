document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("form-login"); // conecta el js con el formulario, busca form-login//
  const correoInput = document.getElementById("correo"); 
  const errorCorreo = document.getElementById("error-correo");
  const contraseñaInput = document.getElementById("contraseña");
  const errorContraseña = document.getElementById("error-contraseña");
  //obtenemos elementos del DOM.

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = correoInput.value.trim();

    if (!validarCorreo(correo)) {
      errorCorreo.textContent =
        "Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";

      correoInput.classList.add("is-invalid");
      return;
    }

    errorCorreo.textContent = "";
    correoInput.classList.remove("is-invalid");

    const contraseña = contraseñaInput.value.trim();

    if(!validarContraseña(contraseña)) {
      errorContraseña.textContent = 
        "La contraseña debe tener entre 4 y 10 caracteres";

      contraseñaInput.classList.add("is-invalid");
      return;
    }

    errorContraseña.textContent = "";
    contraseñaInput.classList.remove("is-invalid");

    localStorage.setItem("lug_correo", correo);
    window.location.href = "index.html";
  });

  correoInput.addEventListener("input", () => {
    const correo = correoInput.value.trim();

      if (correo.includes("@") && !validarCorreo(correo)) {
        errorCorreo.textContent = 
          "Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";

          correoInput.classList.add("is-invalid");
      } else {
        errorCorreo.textContent = "";
        correoInput.classList.remove("is-invalid");
      }
      //no va return porque no se inicia sesion, solo se actualiza visualmente la valdadion en tiempo real.

  });

  contraseñaInput.addEventListener("input", () => {
    const contraseña = contraseñaInput.value;

    if (contraseña !== "" && !validarContraseña(contraseña)) {
      errorContraseña.textContent = 
        "La contraseña debe tener entre 4 y 10 caracteres";

      contraseñaInput.classList.add("is-invalid");
      
    } else {
      errorContraseña.textContent = "";
      contraseñaInput.classList.remove("is-invalid");
    }
});

});

// Validación de correo electrónico
function validarCorreo(correo) {

    const dominiosPermitidos = [
      "@duoc.cl",
      "@profesor.duoc.cl",
      "@gmail.com"
    ];

    return dominiosPermitidos.some(dominio => correo.endsWith(dominio)
  );
}

function validarContraseña(contraseña) {
  return contraseña.length >= 4 && contraseña.length <=10; 
}

