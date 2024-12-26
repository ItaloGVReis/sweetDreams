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
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, nome, descricao, image_url, categoria FROM products")
    resultados = cursor.fetchall()
    produtos = [
        {
            'id': product[0],
            'nome': product[1],
            'descricao': product[2],
            'image_url': product[3],
            'categoria': product[4]
        }
        for product in resultados
    ]
    return render_template('index.html', produtos=produtos)

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
    # Obtém o ID da query string
    id = request.args.get('id')
    if not id:
        return "ID não fornecido", 400  # Retorna um erro se o ID não for passado

    try:
        cursor = mysql.connection.cursor()
        # Busca os detalhes do produto com base no ID
        cursor.execute("""
            SELECT id, nome, descricao, image_url, image_url2, image_url3, image_url4, adicional, adicional2, preco 
            FROM products WHERE id = %s
        """, (id,))
        produto = cursor.fetchone()
        cursor.close()

        if produto:
            # Transforma o resultado em um dicionário
            produto_dict = {
                'id': produto[0],
                'nome': produto[1],
                'descricao': produto[2],
                'image_url': produto[3],
                'image_url2': produto[4],
                'image_url3': produto[5],
                'image_url4': produto[6],
                'adicional': produto[7],
                'adicional2': produto[8],
                'preco': produto[9]
            }

            # Renderiza o template com os dados do produto
            return render_template('cardapio.html', produto=produto_dict)
        else:
            # Se nenhum produto for encontrado
            return "Produto não encontrado", 404
    except Exception as e:
        return f"Erro ao buscar a comida: {e}", 500



@app.route('/crud')
def crud():
    return render_template('crud.html')

# Criar um novo produto
@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    cursor = mysql.connection.cursor()
    query = "INSERT INTO products (nome, descricao, preco, image_url, image_url2, image_url3, image_url4, adicional, adicional2, categoria) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (data['nome'], data['descricao'], data['preco'], data['image_url'], data['image_url2'], data['image_url3'], data['image_url4'], data['adicional'], data['adicional2'], data['categoria']))
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
    query = "UPDATE products SET nome = %s, descricao = %s, preco = %s, image_url = %s, image_url2 = %s, image_url3 = %s, image_url4 = %s, adicional = %s, adicional2 = %s, cetegoria = %s"
    cursor.execute(query, (data['nome'], data['descricao'], data['preco'], data['image_url'], data['image_url2'], data['image_url3'], data['image_url4'], data['adicional'], data['adicional2'], data['categoria'], id))
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

    

