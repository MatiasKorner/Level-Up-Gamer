

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.category-btn');
    const featuredPost = document.querySelector('.featured-post');
    const posts = document.querySelectorAll('.post-card');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar active de todos los botones
            buttons.forEach(btn => btn.classList.remove('active'));
            // Marcar el botón actual como activo
            button.classList.add('active');

            const filter = button.dataset.filter; // "all", "reviews", "hardware"

            // ===== Filtrar post destacado =====
            if (filter === 'all' || featuredPost.dataset.category === filter) {
                featuredPost.style.display = 'block';   // ← importante
            } else {
                featuredPost.style.display = 'none';
            }

            // ===== Filtrar posts de la lista =====
            posts.forEach(post => {
                if (filter === 'all' || post.dataset.category === filter) {
                    post.style.display = 'flex';        
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
});
