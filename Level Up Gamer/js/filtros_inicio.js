function filtrarProductos(categoria, botonSeleccionado) {
  const tarjetas = document.querySelectorAll('.tarjeta');
  const botones = document.querySelectorAll('.filtros-categoria button');

  // Quita el estilo activo de todos los botones
  botones.forEach(btn => btn.classList.add('boton-borde'));

  // Activa el botón presionado
  if (botonSeleccionado) {
    botonSeleccionado.classList.remove('boton-borde');
  }

  // Oculta o muestra según el atributo data-categoria
  tarjetas.forEach(tarjeta => {
    const categoriasProducto = tarjeta.getAttribute('data-categoria') || '';

    if (categoria === 'todos' || categoriasProducto.includes(categoria)) {
      tarjeta.style.display = 'flex';
    } else {
      tarjeta.style.display = 'none';
    }
  });
}

// Inicialización limpia
document.addEventListener('DOMContentLoaded', () => {
  // Si estamos en el catálogo, mostramos 'todos'
  if (window.location.pathname.endsWith('catalogo.html')) {
    const botonTodos = document.querySelector('.filtros-categoria button');
    filtrarProductos('todos', botonTodos);
  } else {
    // En inicio.html (o raíz), buscamos el botón de tendencias
    const botonTendencias = document.querySelector('.filtros-categoria button');
    filtrarProductos('tendencias', botonTendencias);
  }
});