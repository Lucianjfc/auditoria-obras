import pandas as pd
from datetime import datetime
import math
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

def criar_caracteristicas(df, row, month, desonerado=False):
    caracteristicas = {}
    caracteristicas['MES_COLETA'] = month
    caracteristicas['DESONERADO'] = desonerado
    colums_float = ['CUSTO', 'ENCARGOS_TOTAIS', 'SALARIO', 'CUSTO_IMPRODUTIVO', 'CUSTO_PRODUTIVO', 'MAO_OBRA_OPERACAO',
                     'OPERACAO', 'MANUTENCAO', 'SEGUROS_IMPOSTOS', 'OPORTUNIDADE_CAPITAL', 'DEPRECIACAO', 'VALOR_AQUISICAO', 'PRECO']

    for coluna in df.columns:
        if coluna not in ['CODIGO', 'DESCRICAO']:
            valor = row[coluna]
            if coluna in colums_float:
                try:
                    valor = float(valor)
                    if math.isnan(valor):
                        valor = None
                except:
                    valor = None
            elif isinstance(valor, str):
                valor = valor.strip()
            caracteristicas[coluna] = valor
    return [caracteristicas]

def combinar_arrays(arrays):
    combined = []
    for array in arrays:
        combined.extend(array)
    return combined

def formatDate(date):
    return datetime.strptime(date, "%Y%m").strftime("%m-%Y")

def separar_caracteristicas(row):
    desonerado = []
    nao_desonerado = []
    for obj in row['CARACTERISTICAS']:
        if obj['DESONERADO']:
            desonerado.append(obj)
        else:
            nao_desonerado.append(obj)
    return pd.Series({'CARACTERISTICAS_DESONERADO': desonerado, 'CARACTERISTICAS_NAO_DESONERADO': nao_desonerado})

SINAPI_DIR = '../../SINAPI/'

months = ['202301','202302', '202303', '202304', '202305', '202306', '202307', '202308','202309', '202310', '202311', '202312', '202401', '202402']
sub_folders = {
    "nao_desonerado": "NaoDesonerado",
    "desonerado": "Desonerado",
}

SINAPI_FILE_NAME = "SINAPI_Preco_Ref_Insumos_AC_"

frames = []
df_consolidado = pd.DataFrame()

for key, value in sub_folders.items():
    for month in months:
        mes_formatado = month[-2:] + month[:-2]

        current_file_path1 = SINAPI_DIR + month + "/" + key + "/" + SINAPI_FILE_NAME + month + "_" + value + '.xlsx'
        current_file_path2 = SINAPI_DIR + month + "/" + key + "/" + SINAPI_FILE_NAME + mes_formatado + "_" + value + '.xlsx'
        current_file_path3 = SINAPI_DIR + month + "/" + key + "/" + SINAPI_FILE_NAME + month + "_" + value + '.xls'
        current_file_path4 = SINAPI_DIR + month + "/" + key + "/" + SINAPI_FILE_NAME + mes_formatado + "_" + value + '.xls'
        dataset_sinapi = []
        try:
            dataset_sinapi = pd.read_excel(current_file_path1, skiprows=6, skipfooter=2)
            print('Sucesso ao ler o arquivo:', current_file_path1)
        except (Exception):
            print('Erro ao ler o arquivo:', current_file_path1)

        try:
            dataset_sinapi = pd.read_excel(current_file_path2, skiprows=6, skipfooter=2)
            print('Sucesso ao ler o arquivo:', current_file_path3)
        except (Exception):
            print('Erro ao ler o arquivo:', current_file_path2)

        try:
            dataset_sinapi = pd.read_excel(current_file_path3, skiprows=6, skipfooter=2)
            print('Sucesso ao ler o arquivo:', current_file_path3)
        except (Exception):
            print('Erro ao ler o arquivo:', current_file_path3)

        try:
            dataset_sinapi = pd.read_excel(current_file_path4, skiprows=6, skipfooter=2)
            print('Sucesso ao ler o arquivo:', current_file_path4)
        except (Exception):
            print('Erro ao ler o arquivo:', current_file_path4)

        dataset_sinapi.columns = dataset_sinapi.columns.str.strip()
        dataset_sinapi = dataset_sinapi.rename(columns={'CODIGO  ': 'CODIGO', 'DESCRICAO DO INSUMO': 'DESCRICAO', 'UNIDADE DE MEDIDA': 'UNIDADE_MEDIDA', 'ORIGEM DO PRECO': 'ORIGEM_PRECO', 'PRECO MEDIANO R$': 'PRECO_MEDIANO' })
        dataset_sinapi['CODIGO'] = dataset_sinapi['CODIGO'].apply(lambda x: f'{x:08d}' )
        #dataset_sinapi['UNIDADE_MEDIDA'] = dataset_sinapi['UNIDADE_MEDIDA'].apply(lambda x: x.upper())
        dataset_sinapi = dataset_sinapi.applymap(lambda x: x.strip() if isinstance(x, str) else x)
        dataset_sinapi['PRECO_MEDIANO'] = dataset_sinapi['PRECO_MEDIANO'].str.replace('[.,]', '', regex=True).str.replace(',', '.')
        dataset_sinapi['PRECO_MEDIANO'] = dataset_sinapi['PRECO_MEDIANO'].astype(float)
        dataset_sinapi['CARACTERISTICAS'] = dataset_sinapi.apply(lambda row: criar_caracteristicas(dataset_sinapi, row, month, key == 'desonerado'), axis=1)
        dataset_sinapi = dataset_sinapi[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]

        if (df_consolidado.shape[0] == 0):
            df_consolidado = pd.concat([dataset_sinapi], ignore_index=True)
        else:
            df_temp = pd.concat([dataset_sinapi], ignore_index=True)
            for i, row in df_temp.iterrows():
                current_codigo = df_temp.at[i, 'CODIGO']
                existe_valor = (df_consolidado['CODIGO'] == current_codigo).any()
                if (existe_valor):
                    caracteristica = df_temp.at[i, 'CARACTERISTICAS']
                    indice_linha = df_consolidado.index[df_consolidado['CODIGO'] == current_codigo].tolist()[0]
                    df_consolidado.loc[indice_linha, 'CARACTERISTICAS'].append(caracteristica[0])
                else:
                    df_consolidado.append(row, ignore_index=True)

dataset_sinapi = df_consolidado.groupby(['CODIGO', 'DESCRICAO'])['CARACTERISTICAS'].agg(combinar_arrays).reset_index()
dataset_sinapi[['CARACTERISTICAS_DESONERADO', 'CARACTERISTICAS_NAO_DESONERADO']] = dataset_sinapi.apply(separar_caracteristicas, axis=1)
dataset_sinapi = dataset_sinapi[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS_DESONERADO', 'CARACTERISTICAS_NAO_DESONERADO']]



model_all_mini = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
dataset_sinapi['ALL_MINI_BASE_VECTOR'] = dataset_sinapi['DESCRICAO'].apply(lambda x: model_all_mini.encode(x))

ELASTIC_PASSWORD = "elastic"
es = Elasticsearch(hosts="http://localhost:9200", basic_auth=("elastic", "elastic"), verify_certs=False)

body_sinapi = {
    "settings":{
        "number_of_shards": 2,
        "number_of_replicas": 1,
         "analysis": {
            "filter": {
                    "brazilian_stop": {
                    "type":       "stop",
                    "stopwords":  "_brazilian_" 
                },
                "brazilian_stemmer": {
                    "type":       "stemmer",
                    "language":   "brazilian"
                }
            },
            "analyzer": {
                "rebuilt_brazilian": {
                    "tokenizer":  "standard",
                    "filter": [
                        "lowercase",
                        "brazilian_stop",
                        "brazilian_stemmer"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "CODIGO": {
                "type": "keyword"
            },
            "DESCRICAO": {
                "type": "text"
            },
            "CARACTERISTICAS_DESONERADO": {
                "type": "nested",
                "properties": {
                    "UNIDADE_MEDIDA": {"type": "text"},
                    "ORIGEM_PRECO": {"type": "text"},
                    "PRECO_MEDIANO": {"type": "float"},
                    "MES_COLETA": {"type": "text"},
                    "DESONERADO": {"type": "boolean"}
                }
            },
            "CARACTERISTICAS_NAO_DESONERADO": {
                "type": "nested",
                "properties": {
                    "UNIDADE_MEDIDA": {"type": "text"},
                    "ORIGEM_PRECO": {"type": "text"},
                    "PRECO_MEDIANO": {"type": "float"},
                    "MES_COLETA": {"type": "text"},
                    "DESONERADO": {"type": "boolean"}
                }
            },
            "ALL_MINI_VECT": {
                "type": "dense_vector",
                "dims": 384,
                "index": True,
                "similarity": "cosine"
            },
        }
    }
}


INDEX_NAME_SINAPI = "sinapi_index"

es.indices.delete(index=INDEX_NAME_SINAPI, ignore=[400, 404])

es.indices.create(index=INDEX_NAME_SINAPI, 
    settings=body_sinapi["settings"],
    mappings=body_sinapi["mappings"])

print(es.indices.exists(index=[INDEX_NAME_SINAPI]))

dataset_sinapi_dic = dataset_sinapi.to_dict("records")

for record in dataset_sinapi_dic:
    try:
        id_record = str(record["CODIGO"])
        es.index(index=INDEX_NAME_SINAPI, document=record, id=id_record)
    except Exception as e:
        print(e)