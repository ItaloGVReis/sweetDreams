document.getElementById("verMais").addEventListener("click", function() {
    var button = document.getElementById("verMais");
    var comidasumElements = document.querySelectorAll(".comidasum");

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
});
