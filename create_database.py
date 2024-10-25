
import sqlite3

# Connect to the database (this will create it if it doesn't exist)
conn = sqlite3.connect('cards.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create the cards table
cursor.execute('''
CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER,
    description TEXT,
    name TEXT,
    type TEXT,
    condition TEXT,
    cost REAL,
    quantity INTEGER,
    sold BOOLEAN,
    UNIQUE(id, year, name)
)
''')

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database created successfully.")
