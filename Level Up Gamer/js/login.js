document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("form-login"); // conecta el js con el formulario, busca form-login//
  const correoInput = document.getElementById("correo"); 
  const errorCorreo = document.getElementById("error-correo");
  const contraseñaInput = document.getElementById("contraseña");
  const errorContraseña = document.getElementById("error-contraseña");
  const loginContenedor = document.querySelector(".login-contenedor");
  const botonAdmin = document.getElementById("btn-admin");
  const botonCliente = document.getElementById("btn-cliente");
  const formularioAdmin = document.getElementById("form-admin");
  const correoAdminInput = document.getElementById("correo-admin");
  const errorCorreoAdmin = document.getElementById("error-correo-admin");
  const contraseñaAdminInput = document.getElementById("contraseña-admin");
  const errorContraseñaAdmin = document.getElementById("error-contraseña-admin");
  //obtenemos elementos del DOM.

  const usuarioAdmin = [
    {
      correo: "admin@levelup.cl",
      contraseña: "admin123",
      rol: "Administrador"
    },
    {
      correo: "vendedor@levelup.cl",
      contraseña: "vende123",
      rol: "Vendedor"
    }
  ];

  botonAdmin.addEventListener("click", () => {
    loginContenedor.classList.add("admin-activo");
  });

  botonCliente.addEventListener("click", () => {
    loginContenedor.classList.remove("admin-activo");
  });
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

    const usuarioRegistrado = JSON.parse(
  localStorage.getItem("lug_usuario_registrado")
);

    if (
      !usuarioRegistrado ||
      usuarioRegistrado.correo !== correo ||
      usuarioRegistrado.contraseña !== contraseña
    ) {
      errorContraseña.textContent = "Correo o contraseña incorrectos";
      contraseñaInput.classList.add("is-invalid");
      return;
    }

    const usuarioSesion = {
      nombre: usuarioRegistrado.nombre,
      correo: usuarioRegistrado.correo,
      telefono: usuarioRegistrado.telefono,
      nivel: usuarioRegistrado.nivel,
      puntos: usuarioRegistrado.puntos,
      puntosSiguienteNivel: usuarioRegistrado.puntosSiguienteNivel,
      pedidosRealizados: usuarioRegistrado.pedidosRealizados
    };

    localStorage.setItem("lug_correo", correo);
    localStorage.setItem("lug_user", JSON.stringify(usuarioSesion));

    window.location.href = "index.html";

  });

  formularioAdmin.addEventListener("submit", (e) => {
  e.preventDefault();

  const correoAdmin = correoAdminInput.value.trim();

  if (!correoAdmin.endsWith("@levelup.cl")) {
    errorCorreoAdmin.textContent =
      "Ingresa un correo administrativo @levelup.cl";

    correoAdminInput.classList.add("is-invalid");
    return;
  }

  errorCorreoAdmin.textContent = "";
  correoAdminInput.classList.remove("is-invalid");

  const contraseñaAdmin = contraseñaAdminInput.value.trim();

  if (!validarContraseña(contraseñaAdmin)) {
    errorContraseñaAdmin.textContent =
      "La contraseña debe tener entre 4 y 10 caracteres";

    contraseñaAdminInput.classList.add("is-invalid");
    return;
  }

  errorContraseñaAdmin.textContent = "";
  contraseñaAdminInput.classList.remove("is-invalid");
  
  const usuarioEncontrado = usuarioAdmin.find(usuario =>
    usuario.correo === correoAdmin &&
    usuario.contraseña === contraseñaAdmin
  );

  if (!usuarioEncontrado){
    errorContraseñaAdmin.textContent = "Correo o contraseña incorrectos"
    contraseñaAdminInput.classList.add("is-invalid");
    return;
  }

  errorContraseñaAdmin.textContent = "";
  contraseñaAdminInput.classList.remove("is-invalid");

  localStorage.setItem("lug_correo", usuarioEncontrado.correo);
  localStorage.setItem("lug_rol", usuarioEncontrado.rol);

  alert("Bienvenido " + usuarioEncontrado.rol);
  window.location = "admin.html";


  // Más adelante aquí validaremos el rol y el acceso administrativo.
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
  correoAdminInput.addEventListener("input", () => {
  const correoAdmin = correoAdminInput.value.trim();

  if (correoAdmin.includes("@") && !correoAdmin.endsWith("@levelup.cl")) {
    errorCorreoAdmin.textContent =
      "Ingresa un correo administrativo @levelup.cl";

    correoAdminInput.classList.add("is-invalid");
  } else {
    errorCorreoAdmin.textContent = "";
    correoAdminInput.classList.remove("is-invalid");
  }
});

contraseñaAdminInput.addEventListener("input", () => {
  const contraseñaAdmin = contraseñaAdminInput.value;

  if (contraseñaAdmin !== "" && !validarContraseña(contraseñaAdmin)) {
    errorContraseñaAdmin.textContent =
      "La contraseña debe tener entre 4 y 10 caracteres";

    contraseñaAdminInput.classList.add("is-invalid");
  } else {
    errorContraseñaAdmin.textContent = "";
    contraseñaAdminInput.classList.remove("is-invalid");
  }
});

// Entrar a la tienda sin iniciar sesion
const botonInvitado = document.getElementById("btn-invitado");

if (botonInvitado) {
  botonInvitado.addEventListener("click", () => {
    localStorage.removeItem("lug_user");
    localStorage.removeItem("lug_correo");
    localStorage.removeItem("lug_rol");
  });
}

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

