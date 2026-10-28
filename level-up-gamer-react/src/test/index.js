// Busca automáticamente todos los archivos *.spec.js / *.spec.jsx dentro de src/
const contexto = import.meta.webpackContext("../", {
  recursive: true,
  regExp: /\.spec\.jsx?$/,
});
contexto.keys().forEach(contexto);