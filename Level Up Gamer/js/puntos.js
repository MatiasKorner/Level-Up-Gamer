/* puntos.js — Lógica de la página puntos.html (10) */

document.addEventListener("DOMContentLoaded", () => {
  function render() {
    const u = LevelUp.Usuario.obtener();
    document.getElementById("puntos-valor").textContent = u.puntos.toLocaleString("es-CL");
    document.getElementById("nivel-progreso-texto").textContent = `Nivel ${u.nivel} → Nivel ${u.nivel + 1}`;
    document.getElementById("rango-actual").textContent = `${u.puntos.toLocaleString("es-CL")} pts`;
    document.getElementById("rango-siguiente").textContent = `${u.puntosSiguienteNivel.toLocaleString("es-CL")} pts`;

    const pct = Math.min(100, Math.round((u.puntos / u.puntosSiguienteNivel) * 100));
    document.getElementById("barra-progreso-fill").style.width = pct + "%";

    document.querySelectorAll(".reward-btn").forEach((btn) => {
      const costo = Number(btn.dataset.costo);
      btn.disabled = u.puntos < costo;
    });
  }

  document.querySelectorAll(".reward-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const costo = Number(btn.dataset.costo);
      const u = LevelUp.Usuario.obtener();
      if (u.puntos < costo) {
        LevelUp.toast("No tienes puntos suficientes para este canje.");
        return;
      }
      LevelUp.Usuario.actualizar({ puntos: u.puntos - costo });
      LevelUp.toast(`Canjeaste: ${btn.dataset.nombre}`);
      render();
    })
  );

  render();
});
