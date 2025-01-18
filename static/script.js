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
const productList = document.getElementById('product-list');

// Carregar produtos
function loadproducts1() {
    fetch('/api/products1')
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = '';
            data.forEach(product => {
                productList.innerHTML += `
                    <tr>
                        <td>${product[0]}</td>
                        <td>${product[1]}</td>
                        <td>${product[2]}</td>
                        <td>R$ ${product[3]}</td>
                        <td><img src="${product[4]}" alt="Imagem" width="50"></td>
                        <td><img src="${product[5]}" alt="Imagem2" width="50"></td>
                        <td><img src="${product[6]}" alt="Imagem3" width="50"></td>
                        <td><img src="${product[7]}" alt="Imagem4" width="50"></td>
                        <td>${product[8]}</td>
                        <td>${product[9]}</td>
                        <td>${product[10]}</td>
                     
                        <td>
                            <button onclick="editProduct(${product[0]}, '${product[1]}', '${product[2]}', ${product[3]}, '${product[4]}', '${product[5]}', '${product[6]}', '${product[7]}', '${product[8]}', '${product[9]}', '${product[10]}' )">Editar</button>
                            <button onclick="deleteProduct(${product[0]})">Deletar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Adicionar/Atualizar produto
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value.trim(); // Certifica-se de que o ID está limpo
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/products1/${id}` : '/api/products1';
    const productData = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: parseFloat(document.getElementById('preco').value),
        image_url: document.getElementById('image_url').value,
        image_url2: document.getElementById('image_url2').value,
        image_url3: document.getElementById('image_url3').value,
        image_url4: document.getElementById('image_url4').value,
        adicional: document.getElementById('adicional').value,
        adicional2: document.getElementById('adicional2').value,
        categoria: document.getElementById('categoria').value
    };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Produto atualizado com sucesso!');
            form.reset();
            loadproducts1(); // Certifique-se de que esta função está implementada corretamente
        })
        .catch(error => console.error('Erro:', error));
});


// Preencher formulário para edição
function editProduct(id, nome, descricao, preco, image_url, image_url2, image_url3, image_url4, adicional, adicional2, categoria) {
    document.getElementById('product-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.getElementById('preco').value = preco;
    document.getElementById('image_url').value = image_url;
    document.getElementById('image_url2').value = image_url2;
    document.getElementById('image_url3').value = image_url3;
    document.getElementById('image_url4').value = image_url4;
    document.getElementById('adicional').value = adicional;
    document.getElementById('adicional2').value = adicional2;
    document.getElementById('categoria').value = categoria;

}

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
