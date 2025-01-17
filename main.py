from flask import Flask, render_template, request, jsonify, redirect
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
# @app.route('/test-db')
# def test_db():
#     cursor = mysql.connection.cursor()
#     cursor.execute('SELECT 1 + 1 AS solution')
#     result = cursor.fetchone()
#     cursor.close()
#     return f'A solução é: {result[0]}'

@app.route('/cardapio', methods=['GET', 'POST'])
def cardapio():
    id = request.args.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT id, image_url 
        FROM products 
        WHERE id != %s 
        ORDER BY RAND() 
        LIMIT 20
    """, (id,))
    resultado = cursor.fetchall()
    fotos = [
        {
            'id': foto[0],
            'image_url': foto[1]
        }
        for foto in resultado
    ]

    if request.method == 'POST':
        # Pega os dados do formulário
        product_id = request.form.get('product_id')
        user_name = request.form.get('user_name')
        avaliacao = request.form.get('avaliacao')

        # Verifica se os campos necessários foram preenchidos
        if not product_id or not user_name or not avaliacao:
            return "Dados inválidos", 400

        try:
            # Salva os dados no banco de dados
            cursor = mysql.connection.cursor()
            query = """
                INSERT INTO produto_avaliacao (product_id, user_name, avaliacao)
                VALUES (%s, %s, %s)
            """
            cursor.execute(query, (product_id, user_name, avaliacao))
            mysql.connection.commit()
            cursor.close()

            return redirect(request.url)  # Redireciona para a mesma página, para evitar reenvios duplos

        except Exception as e:
            return f"Erro ao salvar avaliação: {e}", 500

    # Se for GET, busca o produto com o ID na query string
    id = request.args.get('id')
    if not id:
        return "ID não fornecido", 400  # Retorna um erro se o ID não for passado

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT id, nome, descricao, image_url, image_url2, image_url3, image_url4, adicional, adicional2, preco 
            FROM products WHERE id = %s
        """, (id,))
        produto = cursor.fetchone()

        if produto:
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

            # Busca as avaliações do produto
            cursor.execute("""
                SELECT user_name, avaliacao FROM produto_avaliacao WHERE product_id = %s
            """, (id,))
            reviews = cursor.fetchall()

            # Passa o produto e as avaliações para o template
            return render_template('cardapio.html', produto=produto_dict, reviews=reviews, fotos=fotos)
        else:
            return "Produto não encontrado", 404

    except Exception as e:
        return f"Erro ao buscar o produto: {e}", 500








    
# @app.route('/api/cardapio')
# def avaliacao():
#     cursor = mysql.connection.cursor()
#     # Corrigir a consulta SQL para unir as tabelas 'products' e 'produto_avaliacao'
#     cursor.execute("""
#         SELECT 
#             produto_avaliacao.product_id, 
#             produto_avaliacao.user_name, 
#             produto_avaliacao.nota, 
#             produto_avaliacao.avaliacao
#         FROM 
#             produto_avaliacao 
#         JOIN products 
#             ON produto_avaliacao.product_id = products.id
#     """)
#     resultados = cursor.fetchall()
#     avaliacao = [
#         {
#             'product_id': avaliacao
#             'user_name': avaliacao,
#             'nota': avaliacao[2],
#             'avaliacao': avaliacao[3]
#         }
#         for avaliacao in resultados
#     ]
#     return render_template('cardapio.html', avaliacao=avaliacao)


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
    query = """
        UPDATE products 
        SET nome = %s, descricao = %s, preco = %s, image_url = %s, image_url2 = %s, image_url3 = %s, image_url4 = %s, adicional = %s, adicional2 = %s, categoria = %s 
        WHERE id = %s
    """
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


# @app.route('/api/produto_avaliacao', methods=['POST'])
# def criar_avaliacao():
#     # Pega os dados enviados pelo formulário 
#     product_id = request.form.get('product_id')
#     user_name = request.form.get('user_name')
#     avaliacao = request.form.get('avaliacao')

#     if not product_id or not user_name or not avaliacao:
#         return jsonify({'message': 'Dados inválidos'}), 400

#     try:
#         cursor = mysql.connection.cursor()
#         query = """
#             INSERT INTO produto_avaliacao (product_id, user_name, avaliacao)
#             VALUES (%s, %s, %s)
#         """
#         cursor.execute(query, (product_id, user_name, avaliacao))
#         mysql.connection.commit()
#         cursor.close()
        
#         return jsonify({'message': 'Avaliação criada com sucesso!'}), 201
#     except Exception as e:
#         return jsonify({'message': f'Erro ao salvar avaliação: {e}'}), 500





if __name__ == "__main__":
    app.run(debug=True)

    

