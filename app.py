
from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('cards.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/addCards', methods=['POST'])
def add_cards():
    card_data = request.json
    quantity = int(card_data['quantity'])
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for _ in range(quantity):
            cursor.execute('''
                INSERT INTO data 
                (year, description, name, type, condition, cost, quantity, sold)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                card_data['year'],
                card_data['description'],
                card_data['name'],
                card_data['type'],
                card_data['condition'],
                card_data['cost'],
                1,  # Each record represents a single card
                card_data['sold']
            ))
        conn.commit()
        return jsonify({'count': quantity}), 200
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/queryCards', methods=['GET'])
def query_cards():
    year = request.args.get('year', '')
    description = request.args.get('description', '')
    name = request.args.get('name', '')
    sold = request.args.get('sold', '')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = '''
            SELECT id, year, description, name, type, condition, cost, quantity, sold
            FROM data 
            WHERE 1=1
        '''
        params = []
        
        if year:
            query += ' AND year = ?'
            params.append(year)
        if description:
            query += ' AND description LIKE ?'
            params.append(f'%{description}%')
        if name:
            query += ' AND name LIKE ?'
            params.append(f'%{name}%')
        if sold:
            query += ' AND sold = ?'
            params.append(int(sold))
        
        query += ' ORDER BY id ASC'
        
        cursor.execute(query, params)
        results = [dict(row) for row in cursor.fetchall()]
        return jsonify(results), 200
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/modifyCard', methods=['POST'])
def modify_card():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if data['field'] == 'sold':
            data['newValue'] = int(data['newValue'])
        cursor.execute(f"UPDATE data SET {data['field']} = ? WHERE id = ?",
                       (data['newValue'], data['cardId']))
        conn.commit()
        return jsonify({'changes': cursor.rowcount}), 200
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)