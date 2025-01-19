from flask import Flask, render_template, request, jsonify, redirect
from flask_mysqldb import MySQL
from config import Config
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

mysql = MySQL(app)

# Rota para servir o index.html
@app.route('/')
def home():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, nome, descricao, image_url, categoria FROM products1")
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



@app.route('/cardapio', methods=['GET', 'POST'])
def cardapio():
    id = request.args.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT id, image_url 
        FROM products1 
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
            FROM products1 WHERE id = %s
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








    



@app.route('/crud')
def crud():
    return render_template('crud.html')

# Criar um novo produto
@app.route('/api/products1', methods=['POST'])
def create_product():
    data = request.json
    cursor = mysql.connection.cursor()
    query = "INSERT INTO products1 (nome, descricao, preco, image_url, image_url2, image_url3, image_url4, adicional, adicional2, categoria) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (data['nome'], data['descricao'], data['preco'], data['image_url'], data['image_url2'], data['image_url3'], data['image_url4'], data['adicional'], data['adicional2'], data['categoria']))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Produto criado com sucesso!'})

# Ler todos os produtos
@app.route('/api/products1', methods=['GET'])
def get_products1():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM products1")
    products1 = cursor.fetchall()
    cursor.close()
    return jsonify(products1)

# Atualizar um produto existente
@app.route('/api/products1/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.json
    cursor = mysql.connection.cursor()
    query = """
        UPDATE products1 
        SET nome = %s, descricao = %s, preco = %s, image_url = %s, image_url2 = %s, image_url3 = %s, image_url4 = %s, adicional = %s, adicional2 = %s, categoria = %s 
        WHERE id = %s
    """
    cursor.execute(query, (data['nome'], data['descricao'], data['preco'], data['image_url'], data['image_url2'], data['image_url3'], data['image_url4'], data['adicional'], data['adicional2'], data['categoria'], id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Produto atualizado com sucesso!'})


# Deletar um produto
@app.route('/api/products1/<int:id>', methods=['DELETE'])
def delete_product(id):
    cursor = mysql.connection.cursor()
    query = "DELETE FROM products1 WHERE id = %s"
    cursor.execute(query, (id,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': 'Produto deletado com sucesso!'})







if __name__ == "__main__":
    app.run(debug=False)

    

