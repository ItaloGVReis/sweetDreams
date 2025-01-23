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
function loadProducts() {
    fetch('/api/products1')  // Chama a API para pegar os produtos
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Limpa a tabela antes de adicionar novos produtos
            data.forEach(product => {
                // Adiciona os produtos na tabela
                productList.innerHTML += `
                    <tr>
                        <td data-label="ID">${product[0]}</td>
                        <td data-label="Nome">${product[1]}</td>
                        <td data-label="Descrição">${product[2]}</td>
                        <td data-label="Preço">R$ ${product[3]}</td>
                        <td data-label="Imagem"><img src="${product[4]}" alt="Imagem 1" width="50"></td>
                        <td data-label="Imagem 2"><img src="${product[5]}" alt="Imagem 2" width="50"></td>
                        <td data-label="Imagem 3"><img src="${product[6]}" alt="Imagem 3" width="50"></td>
                        <td data-label="Imagem 4"><img src="${product[7]}" alt="Imagem 4" width="50"></td>
                        <td data-label="Adicional">${product[8]}</td>
                        <td data-label="Adicional 2">${product[9]}</td>
                        <td data-label="Categoria">${product[10]}</td>
                        <td data-label="Ações">
                            <button onclick="editProduct(${product[0]})" class="buton">Editar</button>
                            <button onclick="deleteProduct(${product[0]})" class="buton">Deletar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Erro ao carregar os produtos:', error));
}

// Função para criar um novo produto
document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('adicional', document.getElementById('adicional').value);
    formData.append('adicional2', document.getElementById('adicional2').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('image_url', document.getElementById('image_url').files[0]);
    formData.append('image_url2', document.getElementById('image_url2').files[0]);
    formData.append('image_url3', document.getElementById('image_url3').files[0]);
    formData.append('image_url4', document.getElementById('image_url4').files[0]);

    fetch('/api/products1', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadProducts();  // Recarrega os produtos após a criação
    })
    .catch(error => console.error('Erro ao criar o produto:', error));
});
// Função para atualizar um produto
document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const productId = document.getElementById('product-id').value;
    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('adicional', document.getElementById('adicional').value);
    formData.append('adicional2', document.getElementById('adicional2').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('image_url', document.getElementById('image_url').files[0]);
    formData.append('image_url2', document.getElementById('image_url2').files[0]);
    formData.append('image_url3', document.getElementById('image_url3').files[0]);
    formData.append('image_url4', document.getElementById('image_url4').files[0]);

    fetch(`/api/products1/${productId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadProducts();  // Recarrega os produtos após a atualização
    })
    .catch(error => console.error('Erro ao atualizar o produto:', error));
});

// Função para editar um produto
// Função para editar um produto
function editProduct(id) {
    fetch(`/api/products1/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('product-id').value = product[0];
            document.getElementById('nome').value = product[1];
            document.getElementById('descricao').value = product[2];
            document.getElementById('preco').value = product[3];
            document.getElementById('adicional').value = product[8];
            document.getElementById('adicional2').value = product[9];
            document.getElementById('categoria').value = product[10];

            // Exibe as imagens atuais no formulário
            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = ''; // Limpa as imagens anteriores exibidas

            if (product[4]) {  // Verifica se a imagem 1 existe
                imageContainer.innerHTML += `<img src="${product[4]}" alt="Imagem 1" width="100" class="product-image">`;
            }

            if (product[5]) {  // Verifica se a imagem 2 existe
                imageContainer.innerHTML += `<img src="${product[5]}" alt="Imagem 2" width="100" class="product-image">`;
            }

            if (product[6]) {  // Verifica se a imagem 3 existe
                imageContainer.innerHTML += `<img src="${product[6]}" alt="Imagem 3" width="100" class="product-image">`;
            }

            if (product[7]) {  // Verifica se a imagem 4 existe
                imageContainer.innerHTML += `<img src="${product[7]}" alt="Imagem 4" width="100" class="product-image">`;
            }
        })
        .catch(error => console.error('Erro ao carregar produto para edição:', error));
}

// Chama a função para carregar os produtos quando a página for carregada
window.onload = loadProducts;


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
