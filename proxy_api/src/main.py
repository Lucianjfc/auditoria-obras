from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
from utils.utils import criar_novo_objeto_sicro, criar_novo_objeto_sinapi

PORT = 5001

app = Flask(__name__)

ELASTIC_PASSWORD = "elastic"
INDEX_NAME_SINAPI = "sinapi_index"
INDEX_NAME_SICRO = "sicro_index"

model_all_mini = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
es = Elasticsearch(hosts="https://172.20.12.110:9200", basic_auth=("elastic", "mkYozxvG9TEhWd8"), verify_certs=False)

def get_source_by_index(index):
    sources = [
        {INDEX_NAME_SINAPI: ["CODIGO", "DESCRICAO", "CARACTERISTICAS_NAO_DESONERADO", "CARACTERISTICAS_DESONERADO"]},
        {INDEX_NAME_SICRO: ["CODIGO", "DESCRICAO", "CARACTERISTICAS_NAO_DESONERADO", "CARACTERISTICAS_DESONERADO"]}]

    for source_dict in sources:
        if index in source_dict:
            return source_dict[index]
    return []

def run_query(vector_of_input, index_search, source, pageIndex, pageSize):

    query = {
            "field" : "ALL_MINI_BASE_VECTOR",
            "query_vector": vector_of_input,
            "k": pageIndex * pageSize,
            "num_candidates": 500,
        }
    
    res = es.knn_search(
        index=index_search,
        knn=query,
        source=source,
    )
    return res["hits"]["hits"][-pageSize:]

@app.route('/search-sicro', methods=['POST'])
def search_sicro():
    if request.method == 'POST':
        data = request.json
        if data and 'search' in data:
            search_query = data['search']
            page_size = data['page']['size']
            page_index = data['page']['index']

            vector_input = model_all_mini.encode(search_query)
            response = run_query(vector_input, INDEX_NAME_SICRO, get_source_by_index(INDEX_NAME_SICRO), page_index, page_size)
            nova_lista_objetos = [criar_novo_objeto_sicro(objeto) for objeto in response]
            return jsonify({"message": "Consulta recebida com sucesso", "response": nova_lista_objetos}), 200
        else:
            return jsonify({"error": "Formato de dados inválido"}), 400
    else:
        return jsonify({"error": "Método de requisição inválido"}), 405

@app.route('/search-sinapi', methods=['POST'])
def search_sinapi():
    if request.method == 'POST':
        data = request.json
        if data and 'search' in data:
            search_query = data['search']
            page_size = data['page']['size']
            page_index = data['page']['index']

            vector_input = model_all_mini.encode(search_query)
            response = run_query(vector_input, INDEX_NAME_SINAPI, get_source_by_index(INDEX_NAME_SINAPI), page_index, page_size)
            nova_lista_objetos = [criar_novo_objeto_sinapi(objeto) for objeto in response]
            return jsonify({"message": "Consulta recebida com sucesso", "response": nova_lista_objetos}), 200
        else:
            return jsonify({"error": "Formato de dados inválido"}), 400
    else:
        return jsonify({"error": "Método de requisição inválido"}), 405

app.run(port=PORT)