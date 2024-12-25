from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
from config import Config
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Configuração do banco de dados
app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
app.config['MYSQL_USER'] = os.getenv('DB_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('DB_NAME')
app.config['MYSQL_PORT'] = int(os.getenv('DB_PORT'))

mysql = MySQL(app)

# Rota para servir o index.html
@app.route('/')
def home():
    return render_template('index.html')

# Rota para testar a conexão com o banco de dados
@app.route('/test-db')
def test_db():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT 1 + 1 AS solution')
    result = cursor.fetchone()
    cursor.close()
    return f'A solução é: {result[0]}'

@app.route('/cardapio')
def cardapio():
    # cursor = mysql.connection.cursor()
    # cursor.execute('SELECT nome FROM pratos')  # Suponha que "pratos" é uma tabela
    # pratos = cursor.fetchall()
    # cursor.close()
    return render_template('cardapio.html')#, pratos=pratos)


@app.route('/crud')
def crud():
    return render_template('crud.html')

# Criar um novo produto
@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    cursor = mysql.connection.cursor()
    query = "INSERT INTO products (nome, descricao, preco, image_url, image_url2, image_url3, image_url4, adicional, adicional2) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (data['nome'], data['descricao'], data['preco'], data['image_url'], data['image_url2'], data['image_url3'], data['image_url4'], data['adicional'], data['adicional2']))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Produto criado com sucesso!'})

# Ler todos os produtos
@app.route('/api/products', methods=['GET'])
def get_products():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    return jsonify(products)

# Atualizar um produto existente
@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.json
    cursor = mysql.connection.cursor()
    query = "UPDATE products SET nome = %s, descricao = %s, preco = %s, image_url = %s, image_url2 = %s, image_url3 = %s, image_url4 = %s, adicional = %s, adicional2 = %s"
    cursor.execute(query, (data['nome'], data['descricao'], data['preco'], data['image_url'], data['image_url2'], data['image_url3'], data['image_url4'], data['adicional'], data['adicional2'], id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Produto atualizado com sucesso!'})

# Deletar um produto
@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    cursor = mysql.connection.cursor()
    query = "DELETE FROM products WHERE id = %s"
    cursor.execute(query, (id,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Produto deletado com sucesso!'})

if __name__ == "__main__":
    app.run(debug=True)

    

