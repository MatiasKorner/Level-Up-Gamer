const form = document.getElementById('reportForm')

form.addEventListener('submit', event => {
    event.preventDefault()
    event.stopPropagation()

    const usernameInput = form.username
    const titleInput = form.title
    const descriptionInput = form.description

    const username = usernameInput.value.trim()
    const title = titleInput.value.trim()
    const description = descriptionInput.value.trim()

    // Resetear validaciones personalizadas
    usernameInput.setCustomValidity('')
    titleInput.setCustomValidity('')
    descriptionInput.setCustomValidity('')

    // validaciones
    if (username.length < 3) {
        usernameInput.setCustomValidity('El nombre de usuario debe tener al menos 4 caracteres (sin contar espacios).')
    }

    if (title.length < 5) {
        titleInput.setCustomValidity('El título debe tener al menos 5 caracteres (sin contar espacios).')
    }

    if (description.length < 10) {
        descriptionInput.setCustomValidity('La descripción debe tener al menos 10 caracteres (sin contar espacios).')
    }

    if (!form.checkValidity()) {
        form.classList.add('was-validated')
        return
    }

    form.classList.add('was-validated')

    // Cerrar modal de reporte
    const reportModal = bootstrap.Modal.getInstance(document.getElementById('reportModal'))
    reportModal.hide()

    // Abrir modal de éxito
    const successModal = new bootstrap.Modal(document.getElementById('successModal'))
    successModal.show()

    // Limpiar formulario
    form.reset()
    form.classList.remove('was-validated')
})