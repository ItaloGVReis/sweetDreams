import os
from dotenv import load_dotenv

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

class Config:
    # Carregar variáveis de ambiente
    MYSQL_HOST = os.getenv("MYSQL_HOST")  # Conexão interna (privada) do Railway
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT"))
    
    # URL para a conexão MySQL (usar MYSQL_URL para a conexão completa)
    MYSQL_URI = f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    
    # Configuração do banco de dados para o Flask
    SQLALCHEMY_DATABASE_URI = MYSQL_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False