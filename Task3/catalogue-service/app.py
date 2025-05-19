# catalogue-service/app.py
from flask import Flask, jsonify, request
import os
import psycopg2
from decimal import Decimal
from psycopg2.extras import RealDictCursor
import time

app = Flask(__name__)

# Configuration de la base de données
DB_HOST = os.environ.get('DB_HOST', 'postgres')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'catalogue')
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'postgres')

def get_db_connection():
    max_retries = 5
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD
            )
            return conn
        except psycopg2.OperationalError as e:
            retry_count += 1
            print(f"Connexion à la base de données échouée. Tentative {retry_count}/{max_retries}")
            time.sleep(2)
    
    raise Exception("Impossible de se connecter à la base de données après plusieurs tentatives")

# Route pour obtenir tous les produits
@app.route('/products', methods=['GET'])
def get_products():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM products')
        products = cur.fetchall()
        # Convert Decimal to float for JSON serialization
        for product in products:
            for key, value in product.items():
                if isinstance(value, Decimal):
                    product[key] = float(value)
        cur.close()
        conn.close()
        return jsonify(products)
    except Exception as e:
        app.logger.error(f"Erreur lors de la récupération des produits: {e}")
        return jsonify({"error": str(e)}), 500

# Route pour obtenir un produit par son ID
@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
        product = cur.fetchone()
        cur.close()
        conn.close()
        
        if product:
                        # Convert Decimal to float for JSON serialization
            for key, value in product.items():
                if isinstance(value, Decimal):
                    product[key] = float(value)
            return jsonify(product)
        return jsonify({"error": "Produit non trouvé"}), 404
    except Exception as e:
        app.logger.error(f"Erreur lors de la récupération du produit {product_id}: {e}")
        return jsonify({"error": str(e)}), 500

# Route pour créer un nouveau produit
@app.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ('name', 'description', 'price')):
            return jsonify({"error": "Données incomplètes"}), 400
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            'INSERT INTO products (name, description, price) VALUES (%s, %s, %s) RETURNING *',
            (data['name'], data['description'], data['price'])
        )
        
        new_product = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        # Convert Decimal to float for JSON serialization in the returned new_product
        if new_product:
            for key, value in new_product.items():
                if isinstance(value, Decimal):
                    new_product[key] = float(value)

        return jsonify(new_product), 201
    except Exception as e:
        app.logger.error(f"Erreur lors de la création du produit: {e}")
        return jsonify({"error": str(e)}), 500

# Route de santé pour les healthchecks
@app.route('/health', methods=['GET'])
def health_check():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({"status": "UP"}), 200
    except Exception as e:
        app.logger.error(f"Healthcheck échoué: {e}")
        return jsonify({"status": "DOWN", "error": str(e)}), 503

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
