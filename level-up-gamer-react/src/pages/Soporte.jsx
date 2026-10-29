import useBodyClass from "../hooks/useBodyClass.js";
import "../css/support.css";
import "../css/inicio.css";

const preguntas = [
  {
    id: "faqOne",
    pregunta: "¿Cómo hago el seguimiento de mi pedido?",
    respuesta:
      "Ve a Historial de Pedidos en tu perfil. Recibirás notificaciones por correo y push en cada etapa del envío.",
  },
  {
    id: "faqTwo",
    pregunta: "¿Cuales son los metodos de pago disponibles?",
    respuesta:
      "Puedes pagar utilizando tarjetas de crédito, débito y los medios de pago disponibles al finalizar tu compra.",
  },
  {
    id: "faqThree",
    pregunta: "¿Puedo devolver un producto?",
    respuesta:
      "Sí. Puedes solicitar la devolución de un producto dentro del plazo establecido, siempre que cumplas con las condiciones de devolución.",
  },
  {
    id: "faqFour",
    pregunta: "¿Los juegos digitales tienen Soporte Tecnico?",
    respuesta:
      "Sí. Nuestro equipo puede ayudarte con problemas relacionados con juegos digitales y tu cuenta.",
  },
];

export default function Soporte() {
  useBodyClass("support-main-page");

  return (
    <main className="support-page">
      {/* Rejilla de Bootstrap: ocupa todo el ancho en móvil y se centra en pantallas grandes */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <section className="support-content">
              <div className="support-icon">🛡️</div>
              <h2>¿En qué podemos ayudarte?</h2>
              <p className="support-subtitle">
                En linea 24/7 para los Gamers Level-Up
              </p>

              {/* Barra de búsqueda de Bootstrap */}
              <div className="input-group search-box">
                <span className="input-group-text">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar artículos de ayuda..."
                />
              </div>

              <h3 className="faq-title">PREGUNTAS FRECUENTES</h3>

              {/* Acordeón de Bootstrap */}
              <div className="accordion faq-accordion" id="faqAccordion">
                {preguntas.map((item, indice) => {
                  const abierto = indice === 0;

                  return (
                    <div className="accordion-item" key={item.id}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${abierto ? "" : "collapsed"}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${item.id}`}
                          aria-expanded={abierto}
                          aria-controls={item.id}
                        >
                          {item.pregunta}
                        </button>
                      </h2>

                      <div
                        id={item.id}
                        className={`accordion-collapse collapse ${abierto ? "show" : ""}`}
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">{item.respuesta}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Tarjeta de WhatsApp */}
                <div className="whatsapp-card">
                  <h3>SOPORTE POR WHATSAPP</h3>

                  <div className="whatsapp-info">
                    <div className="whatsapp-icon">💬</div>
                    <p>
                      Chatea con un experto gamer. Tiempo de respuesta
                      promedio:{" "}
                      <span className="whatsapp-time">3 minutos</span>
                    </p>
                  </div>

                  <button type="button" className="whatsapp-button">
                    CHATEAR AHORA →
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}