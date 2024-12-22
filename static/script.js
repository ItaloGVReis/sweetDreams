document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".tipos");
    const items = document.querySelectorAll(".comidasum");
    let activeFilter = null; // Para rastrear o filtro ativo

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            // Alternar o filtro ativo
            if (activeFilter === filter) {
                activeFilter = null; // Remover o filtro
                showAllItems(); // Mostrar todos os itens
            } else {
                activeFilter = filter; // Atualizar o filtro ativo
                filterItems(filter); // Filtrar itens
            }
        });
    });

    function filterItems(filter) {
        items.forEach(item => {
            if (item.classList.contains(filter)) {
                fadeIn(item);
            } else {
                fadeOut(item);
            }
        });
    }

    function showAllItems() {
        items.forEach(item => fadeIn(item));
    }

    function fadeOut(element) {
        element.style.transition = "opacity 0.5s ease";
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.display = "none";
        }, 500);
    }

    function fadeIn(element) {
        element.style.display = "flex";
        setTimeout(() => {
            element.style.transition = "opacity 0.5s ease";
            element.style.opacity = "1";
        }, 0);
    }
});

