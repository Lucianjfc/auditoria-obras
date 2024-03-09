import pyodbc
import pandas as pd
import os
import warnings

APP_ENV = os.getenv("APP_ENV")

config = {
    'Server': 'localhost',
    'Database': 'LICON_DEV',
    'UID': 'sa',
    'PWD': 'Oil2005iGIS'
}

SQL_DRIVER = '/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.10.so.2.1'

if APP_ENV == 'prod':
    config = {
        'Server': os.getenv("SQLSERVER_HOST"),
        'Database': os.getenv("SQLSERVER_DB"),
        'UID': os.getenv("SQLSERVER_USER"),
        'PWD': os.getenv("SQLSERVER_PASSWORD")
    }
    SQL_DRIVER = "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.10.so.4.1"

def get_connection():
    warnings.filterwarnings('ignore')
    return pyodbc.connect(f'DRIVER={{{SQL_DRIVER}}};Server={{{config["Server"]}}};UID={{{config["UID"]}}};PWD={{{config["PWD"]}}};Encrypt=no;TrustServerCertificate=yes')
    

def query_data(query):
    connection = get_connection()
    cursor = connection.cursor()
    completed = False
    result = [] # sem uso ainda

    try:
        cursor.execute(f'USE {config["Database"]};')
        result = pd.read_sql(query, connection)
        completed = True
    except Exception as e:
        result = str(e)
    finally:
        cursor.close()
        connection.close()
    
    return completed, result

def execute_query(query):
    connection = get_connection()
    cursor = connection.cursor()
    completed = False
    result = [] # sem uso ainda

    try:
        cursor.execute(f'USE {config["Database"]};')
        cursor.execute(query)
        connection.commit()
        completed = True
    except Exception as e:
        result = str(e)
    finally:
        cursor.close()
        connection.close()
    
    return completed, result

def execute_multiple(query_list = []):
    connection = get_connection()
    cursor = connection.cursor()
    completed = False
    result = [] # sem uso ainda
    
    try:
        cursor.execute(f'USE {config["Database"]};')
        for query in query_list:
            cursor.execute(query)
        connection.commit()
        completed = True
    except Exception as e:
        result = str(e)
        print(result)
    finally:
        cursor.close()
        connection.close()
    
    return completed, result
    