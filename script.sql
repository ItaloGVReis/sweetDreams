-- Criar banco de dados
CREATE DATABASE sweetDreams;

-- Usar o banco de dados
USE sweetDreams;

-- Tabela de produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NOT NULL, -- Imagem principal
    image_url2 VARCHAR(255) NOT NULL,
    image_url3 VARCHAR(255) NOT NULL,
    image_url4 VARCHAR(255) NOT NULL,
    adicional VARCHAR(255) NOT NULL,
    adicional2 VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    
);

-- Tabela de avaliações
CREATE TABLE produto_avaliacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    avaliacao TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de sugestões de produtos relacionados
CREATE TABLE product_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    suggested_product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (suggested_product_id) REFERENCES products(id) ON DELETE CASCADE
);
