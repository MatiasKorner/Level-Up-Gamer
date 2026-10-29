import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LevelUp from "../services/tienda.js";
import "../css/estilos.css";
import "../css/cuenta.css";

const RECOMPENSAS = [
  { nombre: "Cupón 10% de descuento", costo: 500 },
  { nombre: "$10.000 CLP en crédito", costo: 2500 },
  { nombre: "Envío gratis — 3 usos", costo: 1000 },
];

const LOGROS = [
  { icono: "🎯", titulo: "Francotirador", bloqueado: false },
  { icono: "💎", titulo: "Comprador Diamante", bloqueado: false },
  { icono: "🔥", titulo: "En Llamas", bloqueado: false },
  { icono: "?", titulo: "Bloqueado", bloqueado: true },
  { icono: "?", titulo: "Bloqueado", bloqueado: true },
  { icono: "?", titulo: "Bloqueado", bloqueado: true },
];

const formatear = (n) => n.toLocaleString("es-CL");

export default function SistemaPuntos() {
  // Sin sesión no se llama a Usuario.obtener() (crea un usuario de ejemplo)
  const [usuario, setUsuario] = useState(() =>
    localStorage.getItem("lug_user") ? LevelUp.Usuario.obtener() : null,
  );

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = "Level-Up Gamer - Puntos LevelUp";
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  // Sin sesión iniciada: al login
  if (!usuario) return <Navigate to="/login" replace />;

  const porcentaje = Math.min(
    100,
    Math.round((usuario.puntos / usuario.puntosSiguienteNivel) * 100),
  );

  function canjear(recompensa) {
    // Se relee el usuario para no depender de un estado desactualizado
    const actual = LevelUp.Usuario.obtener();

    if (actual.puntos < recompensa.costo) {
      LevelUp.toast("No tienes puntos suficientes para este canje.");
      return;
    }

    const actualizado = LevelUp.Usuario.actualizar({
      puntos: actual.puntos - recompensa.costo,
    });
    LevelUp.toast(`Canjeaste: ${recompensa.nombre}`);
    setUsuario(actualizado);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/perfil" className="back-arrow" aria-label="Volver">
          ←
        </Link>
        <h1 className="page-title">Puntos LevelUp</h1>
        <span style={{ width: "1.3rem" }}></span>
      </header>

      <main className="container px-3 pb-5">
        <div className="puntos-card">
          <p className="etiqueta">Tu saldo</p>
          <p className="valor" id="puntos-valor">
            {formatear(usuario.puntos)}
          </p>
          <p className="sub">Puntos LevelUp</p>

          <p className="nivel-progreso" id="nivel-progreso-texto">
            Nivel {usuario.nivel} → Nivel {usuario.nivel + 1}
          </p>
          <div className="barra-progreso">
            <div
              className="barra-progreso-fill"
              id="barra-progreso-fill"
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
          <div className="rango">
            <span id="rango-actual">{formatear(usuario.puntos)} pts</span>
            <span id="rango-siguiente">
              {formatear(usuario.puntosSiguienteNivel)} pts
            </span>
          </div>
        </div>

        <p className="logros-titulo">Logros</p>
        <div className="logros-grid">
          {LOGROS.map((logro, indice) => (
            <div
              className={`logro ${logro.bloqueado ? "bloqueado" : ""}`}
              title={logro.titulo}
              key={indice}
            >
              {logro.icono}
            </div>
          ))}
        </div>

        <p className="logros-titulo">Canjear recompensas</p>

        {RECOMPENSAS.map((recompensa) => (
          <div className="reward-card" key={recompensa.nombre}>
            <div>
              <p className="titulo">{recompensa.nombre}</p>
              <p className="costo">{formatear(recompensa.costo)} pts</p>
            </div>
            <button
              type="button"
              className="reward-btn"
              disabled={usuario.puntos < recompensa.costo}
              onClick={() => canjear(recompensa)}
            >
              Canjear
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}