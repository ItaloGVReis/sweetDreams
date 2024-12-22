from flask import Flask, render_template
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


if __name__ == "__main__":
    app.run(debug=True)

    

