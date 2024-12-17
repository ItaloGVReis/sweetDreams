document.getElementById("verMais").addEventListener("click", function() {
    var button = document.getElementById("verMais");
    var comidasumElements = document.querySelectorAll(".comidasum");
    var comidasElements = document.querySelectorAll(".comidasum");
    const filterButtons = document.querySelectorAll('.tipos');
    const comidas = document.querySelectorAll('.comidas, .comidasum');
    const verMaisButton = document.getElementById("verMais");
    let activeFilter = '';

    if (button.innerText === "Ver Mais") {
        // Mostra as divs comidasum com efeito
        comidasumElements.forEach(function(element) {
            element.style.display = "flex"; // Primeiro, garantir que estejam no layout
            setTimeout(function() {
                element.classList.add("show"); // Depois, aplicar a classe de transição
            }, 10); // Pequeno delay para acionar a transição
        });
        // Altera o texto do botão
        button.innerText = "Ver Menos";
        // Move o botão para o final da div quadrado
        document.querySelector(".quadrado").appendChild(button);
    } else {
        // Oculta as divs comidasum com efeito
        comidasumElements.forEach(function(element) {
            element.classList.remove("show");
            setTimeout(function() {
                element.style.display = "none"; // Ocultar após a transição
            }, 500); // Tempo para a transição terminar
        });
        // Altera o texto do botão
        button.innerText = "Ver Mais";
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            const filteredComidas = document.querySelectorAll(`.comidas.${filter}, .comidasum.${filter}`);

            if (activeFilter === filter) {
                // Desfiltrar e voltar ao normal
                comidas.forEach(comida => {
                    comida.style.display = "flex";
                    comida.classList.remove('show');
                });
                activeFilter = '';
                verMaisButton.style.display = "none";
                verMaisButton.innerText = "Ver Menos";
            } else {
                // Filtrar por categoria
                comidas.forEach(comida => {
                    comida.style.display = "none";
                    comida.classList.remove('show');
                });
                filteredComidas.forEach(comida => {
                    comida.style.display = "flex";
                    setTimeout(function() {
                        comida.classList.add("show");
                    }, 10);
                });
                activeFilter = filter;

            }
        });
    });
});


