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
                        <td><img src="${product[4]}" alt="${product[4]}" width="50"></td>
                        <td><img src="${product[5]}" alt="${product[5]}" width="50"></td>
                        <td><img src="${product[6]}" alt="${product[6]}" width="50"></td>
                        <td><img src="${product[7]}" alt="${product[7]}" width="50"></td>
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
    const id = document.getElementById('product-id').value.trim();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/products1/${id}` : '/api/products1';

    const productData = new FormData();
    productData.append('nome', document.getElementById('nome').value);
    productData.append('descricao', document.getElementById('descricao').value);
    productData.append('preco', parseFloat(document.getElementById('preco').value));
    productData.append('adicional', document.getElementById('adicional').value);
    productData.append('adicional2', document.getElementById('adicional2').value);
    productData.append('categoria', document.getElementById('categoria').value);

    // Adicionando as imagens
    productData.append('image_url', document.getElementById('image_url').files[0]);
    productData.append('image_url2', document.getElementById('image_url2').files[0]);
    productData.append('image_url3', document.getElementById('image_url3').files[0]);
    productData.append('image_url4', document.getElementById('image_url4').files[0]);

    fetch(url, {
        method,
        body: productData,
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Produto atualizado com sucesso!');
            form.reset();
            loadproducts1(); // Atualiza a lista de produtos
        })
        .catch(error => console.error('Erro:', error));
});


// Preencher formulário para edição
function editProduct(id, nome, descricao, preco, image_url, image_url2, image_url3, image_url4, adicional, adicional2, categoria) {
    document.getElementById('product-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.getElementById('preco').value = preco;
    document.getElementById('adicional').value = adicional;
    document.getElementById('adicional2').value = adicional2;
    document.getElementById('categoria').value = categoria;

    // Exibir imagens atuais ao lado dos campos de upload
    document.getElementById('image_url_preview').src = image_url;
    document.getElementById('image_url2_preview').src = image_url2;
    document.getElementById('image_url3_preview').src = image_url3;
    document.getElementById('image_url4_preview').src = image_url4;
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
