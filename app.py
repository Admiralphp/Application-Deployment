from flask import Flask, render_template, request, redirect, url_for
import os
import mysql.connector
import time

app = Flask(__name__)

# Configuration de la base de données depuis les variables d'environnement
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'inventoryuser'),
    'password': os.environ.get('DB_PASSWORD', 'secret'),
    'database': os.environ.get('DB_NAME', 'inventory')
}

def get_db_connection():
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            conn = mysql.connector.connect(**db_config)
            return conn
        except mysql.connector.Error as err:
            if attempt < max_attempts - 1:
                print(f"Échec de connexion à la base de données (tentative {attempt+1}/{max_attempts}): {err}")
                time.sleep(5)
            else:
                raise
    return None

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    with open('schema.sql', 'r') as f:
        # Divisez le fichier en instructions SQL individuelles
        sql_commands = f.read().split(';')
        
        # Exécutez chaque commande séparément
        for command in sql_commands:
            if command.strip():  # Ignorez les lignes vides
                cursor.execute(command)
    
    conn.commit()
    cursor.close()
    conn.close()

@app.route('/')
def index():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('index.html', products=products)

@app.route('/add', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        quantity = request.form['quantity']
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO products (name, price, quantity) VALUES (%s, %s, %s)',
            (name, price, quantity)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return redirect(url_for('index'))
    
    return render_template('product_form.html')

@app.route('/health')
def health():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        cursor.close()
        conn.close()
        return {'status': 'healthy'}, 200
    except:
        return {'status': 'unhealthy'}, 500

if __name__ == '__main__':
    # Initialiser la base de données si le flag est présent
    if os.environ.get('INIT_DB', 'False').lower() == 'true':
        init_db()
    
    app.run(host='0.0.0.0', port=5000)
