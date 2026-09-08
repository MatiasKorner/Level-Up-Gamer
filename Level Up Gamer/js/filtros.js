// Espera a que el HTML esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

  // 1. SELECCIÓN DE ELEMENTOS DEL DOM

  // Contenedor donde están todas las tarjetas de productos
  const rejilla = document.querySelector('.rejilla-productos');

  // Convierte la lista de tarjetas en un Array real
  // (así se pueden usar métodos como .filter() y .sort())
  const tarjetas = Array.from(document.querySelectorAll('.tarjeta'));

  // El select de "Ordenar por..."
  const selectOrden = document.querySelector('.select-orden');

  // El input de búsqueda
  const campoBusqueda = document.querySelector('.campo-busqueda');

  // Todos los botones de categoría (Todos, Consolas, PC)
  const botonesCategoria = document.querySelectorAll('.filtros-categoria .boton-azul[data-categoria], .opcion-categoria');

  // Elementos del menú de los 3 puntos
  const btnMas = document.getElementById('btn-mas-categorias');
  const menuCategorias = document.getElementById('menu-categorias');


  // 2. VARIABLES DE ESTADO

  // Guarda la categoría que el usuario tiene seleccionada actualmente
  let categoriaActual = 'todos';

  // Guarda el texto que el usuario está escribiendo en el buscador
  let textoBusqueda = '';


  
  // 3. FUNCIÓN DE FILTRO POR CATEGORÍA

  // Esta función se llama desde el HTML con onclick="filtrarProductos(...)"
  window.filtrarProductos = function (categoria, boton) {

    // Actualiza la categoría seleccionada
    categoriaActual = categoria;

    // Quita el estilo "activo" de todos los botones
    botonesCategoria.forEach(btn => {
      btn.classList.add('boton-borde');   // vuelve a poner el borde
    });

    // Al botón que se acaba de clickear le quitamos el borde
    // así se ve como "seleccionado"
    if (boton) {
      boton.classList.remove('boton-borde');
    }

    // Cierra el menú de los 3 puntos si estaba abierto
    if (menuCategorias) {
      menuCategorias.classList.remove('activo');
    }

    // Aplica los filtros y el orden con la nueva categoría
    aplicarFiltrosYOrden();
  };


  // Abrir / cerrar el menú de los 3 puntos
  if (btnMas && menuCategorias) {
    btnMas.addEventListener('click', (e) => {
      e.stopPropagation();
      menuCategorias.classList.toggle('activo');
    });

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener('click', (e) => {
      if (!menuCategorias.contains(e.target) && e.target !== btnMas) {
        menuCategorias.classList.remove('activo');
      }
    });
  }


  // 4. EVENTOS DE ORDENAMIENTO Y BÚSQUEDA

  // Cuando el usuario cambia la opción del select...
  selectOrden.addEventListener('change', () => {
    aplicarFiltrosYOrden();
  });

  // Cuando el usuario escribe en el buscador...
  campoBusqueda.addEventListener('input', () => {
    // Guardamos el texto en minúsculas y sin espacios extra
    textoBusqueda = campoBusqueda.value.trim().toLowerCase();
    aplicarFiltrosYOrden();
  });


  // 5. FUNCIÓN PRINCIPAL (FILTRA + ORDENA + MUESTRA)

  function aplicarFiltrosYOrden() {

    // Filtrar las tarjetas

    let visibles = tarjetas.filter(tarjeta => {

      // Obtenemos las categorías de la tarjeta
      // Ejemplo: "consolas tendencias" → ["consolas", "tendencias"]
      const cats = (tarjeta.dataset.categoria || '').toLowerCase().split(/\s+/);

      // Obtenemos el título del producto
      const titulo = tarjeta.querySelector('.titulo-tarjeta')?.textContent.toLowerCase() || '';

      // ¿Coincide con la categoría seleccionada?
      const coincideCategoria =
        categoriaActual === 'todos' || cats.includes(categoriaActual);

      // ¿Coincide con el texto de búsqueda?
      const coincideBusqueda =
        textoBusqueda === '' || titulo.includes(textoBusqueda);

      // Solo se queda si cumple AMBAS condiciones
      return coincideCategoria && coincideBusqueda;
    });


    // PASO 2: Ordenar las tarjetas filtradas
   
    const criterio = selectOrden.value;

    visibles.sort((a, b) => {
      // Extrae título y precio de cada tarjeta
      const tituloA = a.querySelector('.titulo-tarjeta')?.textContent.trim() || '';
      const tituloB = b.querySelector('.titulo-tarjeta')?.textContent.trim() || '';
      const precioA = extraerPrecio(a);
      const precioB = extraerPrecio(b);

      // Según la opción elegida, ordena de forma diferente
      switch (criterio) {
        case 'precio-menor':
          return precioA - precioB;           // de menor a mayor

        case 'precio-mayor':
          return precioB - precioA;           // de mayor a menor

        case 'nombre':
          // Orden alfabético (respeta acentos y ñ)
          return tituloA.localeCompare(tituloB, 'es', { sensitivity: 'base' });

        case 'categoria':
          // Ordena por la primera categoría del data-categoria
          const catA = (a.dataset.categoria || '').split(/\s+/)[0];
          const catB = (b.dataset.categoria || '').split(/\s+/)[0];
          return catA.localeCompare(catB, 'es');

        default:
          return 0; // "Destacados" → deja el orden original
      }
    });


    // PASO 3: Mostrar / ocultar y reordenar en el DOM

    // Primero oculta TODAS las tarjetas
    tarjetas.forEach(t => {
      t.style.display = 'none';
    });

    // muestra solo las que pasaron el filtro
    // se mueven al final del contenedor (las reordena)
    visibles.forEach(t => {
      t.style.display = '';          // las vuelve a mostrar
      rejilla.appendChild(t);        // las mueve al final → se reordenan
    });
  }


  // 6. FUNCIÓN AUXILIAR: EXTRAER PRECIO

  // Convierte "$64.990 CLP" → 64990 (número)
  function extraerPrecio(tarjeta) {
    const texto = tarjeta.querySelector('.precio-tarjeta')?.textContent || '0';

    // Quita todo lo que NO sea un dígito ($, puntos, letras, espacios...)
    const soloNumeros = texto.replace(/[^\d]/g, '');

    // Convierte el string a número
    return parseInt(soloNumeros, 10) || 0;
  }


  // 7. INICIALIZACIÓN

  // Aplica los filtros al cargar la página
  // (por si acaso hay algo seleccionado por defecto)
  aplicarFiltrosYOrden();

});