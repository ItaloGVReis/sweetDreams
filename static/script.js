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


const form = document.getElementById('product-form');


// Carregar produtos
// Função para carregar os produtos
document.addEventListener('DOMContentLoaded', function () {
    // Intercepta o envio do formulário
    document.getElementById('product-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita o envio padrão

        const formData = new FormData(this);

        // Verifica se é criação ou atualização
        const productId = document.getElementById('product-id').value;
        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `/api/products1/${productId}` : '/api/products1';

        fetch(url, {
            method: method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(productId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            location.reload(); // Recarrega a página para atualizar os produtos
        })
        .catch(error => console.error('Erro ao salvar o produto:', error));
    });

    // Função para carregar os dados do produto para edição
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.id;

            fetch(`/api/products1/${productId}`)
                .then(response => response.json())
                .then(product => {
                    // Preenche o formulário com os dados do produto
                    document.getElementById('product-id').value = product.id;
                    document.getElementById('nome').value = product.nome;
                    document.getElementById('descricao').value = product.descricao;
                    document.getElementById('preco').value = product.preco;
                    document.getElementById('adicional').value = product.adicional;
                    document.getElementById('adicional2').value = product.adicional2;
                    document.getElementById('categoria').value = product.categoria;

                    // Limpa os campos de imagem porque não é possível preencher um campo <input type="file">
                    document.getElementById('image_url').value = '';
                    document.getElementById('image_url2').value = '';
                    document.getElementById('image_url3').value = '';
                    document.getElementById('image_url4').value = '';
                })
                .catch(error => console.error('Erro ao carregar o produto para edição:', error));
        });
    });

    // Função para excluir um produto
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.id;

            if (confirm('Tem certeza de que deseja excluir este produto?')) {
                fetch(`/api/products1/${productId}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        alert('Produto excluído com sucesso!');
                        location.reload(); // Recarrega a página para atualizar a lista
                    })
                    .catch(error => console.error('Erro ao excluir o produto:', error));
            }
        });
    });
});


// Deletar produto
function deleteProduct(id) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        fetch(`/api/products1/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => loadproducts1());
    }
}

// Carregar produtos ao iniciar
loadproducts1();




function showModal() {
    document.querySelector(".review-modal").style.display = "flex";
}

function closeModal() {
    document.querySelector(".review-modal").style.display = "none";
}

document.querySelector(".close-btn").onclick = closeModal;

function serio(){
    alert('Aí você já quer é um pai né não?')
}

//butão do áudio
const audio = document.getElementById('meuAudio');
const playPauseButton = document.getElementById('playPause');

playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseButton.textContent = 'Pause';
    } else {
        audio.pause();
        playPauseButton.textContent = 'Play';
    }
});
