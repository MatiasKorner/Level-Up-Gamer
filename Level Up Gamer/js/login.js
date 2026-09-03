document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("form-login");
  const correoInput = document.getElementById("correo");

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = correoInput.value.trim();

    localStorage.setItem("lug_correo", correo);

    window.location.href = "index.html";
  });

});