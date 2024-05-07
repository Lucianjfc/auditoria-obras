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

SICRO_DIR = '../../SICRO/'
months = ['202301', '202304', '202307', '202310']
SICRO_FILE_NAME_COMPOSICOES_CUSTOS = "Relatório Sintético de ComposiçΣes de Custos.xlsx"
SICRO_FILE_NAME_EQUIPAMENTOS = "Relatório Sintético de Equipamentos.xlsx"
SICRO_FILE_NAME_EQUIPAMENTOS_DESONERADOS = "Relatório Sintético de Equipamentos - com desoneraç╞o.xlsx"
SICRO_FILE_NAME_MATERIAIS = "Relatório Sintético de Materiais.xlsx"
SICRO_FILE_NAME_MAO_OBRA = "Relatório Sintético de M╞o de Obra.xlsx"
SICRO_FILE_NAME_MAO_OBRA_DESONERADOS = "Relatório Sintético de M╞o de Obra - com desoneraç╞o.xlsx"

df_frame = []

df_custos=None
df_equipamentos=None
df_equipamentos_desonerados=None
df_materiais=None
df_mao_obra=None
df_mao_obra_desonerados=None
df_consolidado = pd.DataFrame()
for month in months:
    # LENDO OS ARQUIVOS

    file_composicoes_custos = SICRO_DIR + month + "/AC "+ formatDate(month) + " " + SICRO_FILE_NAME_COMPOSICOES_CUSTOS
    file_composicoes_equipamentos = SICRO_DIR + month + "/AC "+ formatDate(month) + " " + SICRO_FILE_NAME_EQUIPAMENTOS
    file_composicoes_equipamentos_desonerados = SICRO_DIR + month + "/AC "+ formatDate(month) + " " + SICRO_FILE_NAME_EQUIPAMENTOS_DESONERADOS
    file_composicoes_materiais = SICRO_DIR + month + "/AC "+ formatDate(month) + " " + SICRO_FILE_NAME_MATERIAIS
    file_composicoes_mao_obra = SICRO_DIR + month + "/AC "+ formatDate(month) + " " + SICRO_FILE_NAME_MAO_OBRA
    file_composicoes_mao_obra_desonerados = SICRO_DIR + month + "/AC "+ formatDate(month) + " " + SICRO_FILE_NAME_MAO_OBRA_DESONERADOS

    print(file_composicoes_custos)
    
    # CRIANDO OS DATAFRAMES

    df_custos = pd.read_excel(file_composicoes_custos, skiprows=2)
    df_custos = df_custos.rename(columns={'Código': 'CODIGO', 'Descrição do Serviço': 'DESCRICAO', 'Unidade': 'UNIDADE_MEDIDA', 'Custo Unitário (R$)': 'PRECO' })

    df_equipamentos = pd.read_excel(file_composicoes_equipamentos, skiprows=2)
    df_equipamentos = df_equipamentos.rename(columns={'Código': 'CODIGO', 'Descrição': 'DESCRICAO',
    'Valor de Aquisição (R$)': 'VALOR_AQUISICAO', 'Depreciação (R$/h)': 'DEPRECIACAO', 'Oportunidade de Capital (R$/h)': 'OPORTUNIDADE_CAPITAL',
      'Seguros e Impostos (R$/h)': 'SEGUROS_IMPOSTOS', 'Manutenção (R$/h)': 'MANUTENCAO', 'Operação (R$/h)': 'OPERACAO',
        'Mão de Obra de Operação (R$/h)': 'MAO_OBRA_OPERACAO', 'Custo Produtivo (R$/h)': 'CUSTO_PRODUTIVO',  'Custo Improdutivo (R$/h)': 'CUSTO_IMPRODUTIVO' })

    df_equipamentos_desonerados = pd.read_excel(file_composicoes_equipamentos_desonerados, skiprows=2)
    df_equipamentos_desonerados = df_equipamentos_desonerados.rename(columns={'Código': 'CODIGO', 'Descrição': 'DESCRICAO',
    'Valor de Aquisição (R$)': 'VALOR_AQUISICAO', 'Depreciação (R$/h)': 'DEPRECIACAO', 'Oportunidade de Capital (R$/h)': 'OPORTUNIDADE_CAPITAL',
      'Seguros e Impostos (R$/h)': 'SEGUROS_IMPOSTOS', 'Manutenção (R$/h)': 'MANUTENCAO', 'Operação (R$/h)': 'OPERACAO',
        'Mão de Obra de Operação (R$/h)': 'MAO_OBRA_OPERACAO', 'Custo Produtivo (R$/h)': 'CUSTO_PRODUTIVO',  'Custo Improdutivo (R$/h)': 'CUSTO_IMPRODUTIVO' })
    
    df_materiais = pd.read_excel(file_composicoes_materiais, skiprows=2)
    df_materiais = df_materiais.rename(columns={'Código': 'CODIGO', 'Descrição': 'DESCRICAO', 'Unidade': 'UNIDADE_MEDIDA', 'Preço Unitário (R$)': 'PRECO' })

    df_mao_obra = pd.read_excel(file_composicoes_mao_obra, skiprows=4)
    df_mao_obra = df_mao_obra.rename(columns={'Código': 'CODIGO', 'Descrição': 'DESCRICAO', 'Unidade': 'UNIDADE_MEDIDA', 'Salário (R$)': 'SALARIO',
    'Encargos Totais': 'ENCARGOS_TOTAIS', 'Custo (R$)': 'CUSTO', 'Periculosidade/\nInsalubridade': 'PERICULOSIDADE_INSALUBRIDADE' })

    df_mao_obra_desonerados = pd.read_excel(file_composicoes_mao_obra_desonerados, skiprows=4)
    df_mao_obra_desonerados = df_mao_obra_desonerados.rename(columns={'Código': 'CODIGO', 'Descrição': 'DESCRICAO', 'Unidade': 'UNIDADE_MEDIDA', 'Salário (R$)': 'SALARIO',
    'Encargos Totais': 'ENCARGOS_TOTAIS', 'Custo (R$)': 'CUSTO', 'Periculosidade/\nInsalubridade': 'PERICULOSIDADE_INSALUBRIDADE' })

    # UNIFICANDO CARACTERISTICAS
    dfs = []

    df_custos['CARACTERISTICAS'] = df_custos.apply(lambda row: criar_caracteristicas(df_custos, row, month), axis=1)
    df_custos = df_custos[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]
    df_custos = df_custos.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    df_equipamentos['CARACTERISTICAS'] = df_equipamentos.apply(lambda row: criar_caracteristicas(df_equipamentos, row, month), axis=1)
    df_equipamentos = df_equipamentos[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]
    df_equipamentos = df_equipamentos.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    df_equipamentos_desonerados['CARACTERISTICAS'] = df_equipamentos_desonerados.apply(lambda row: criar_caracteristicas(df_equipamentos_desonerados, row, month, True), axis=1)
    df_equipamentos_desonerados = df_equipamentos_desonerados[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]
    df_equipamentos_desonerados = df_equipamentos_desonerados.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    df_materiais['CARACTERISTICAS'] = df_materiais.apply(lambda row: criar_caracteristicas(df_materiais, row, month), axis=1)
    df_materiais = df_materiais[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]
    df_materiais = df_materiais.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    df_mao_obra['CARACTERISTICAS'] = df_mao_obra.apply(lambda row: criar_caracteristicas(df_mao_obra, row, month), axis=1)
    df_mao_obra = df_mao_obra[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]
    df_mao_obra = df_mao_obra.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    df_mao_obra_desonerados['CARACTERISTICAS'] = df_mao_obra_desonerados.apply(lambda row: criar_caracteristicas(df_mao_obra_desonerados, row, month, True), axis=1)
    df_mao_obra_desonerados = df_mao_obra_desonerados[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS']]
    df_mao_obra_desonerados = df_mao_obra_desonerados.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    # UNINDO OS DADOS

    dfs.append(df_custos)
    dfs.append(df_equipamentos)
    dfs.append(df_equipamentos_desonerados)
    dfs.append(df_materiais)
    dfs.append(df_mao_obra)
    dfs.append(df_mao_obra_desonerados)

    if (df_consolidado.shape[0] == 0):
        df_consolidado = pd.concat(dfs, ignore_index=True)
    else:
        df_temp = pd.concat(dfs, ignore_index=True)
        for i, row in df_temp.iterrows():
          current_codigo = df_temp.at[i, 'CODIGO']
          existe_valor = (df_consolidado['CODIGO'] == current_codigo).any()
          if (existe_valor):
              caracteristica = df_temp.at[i, 'CARACTERISTICAS']
              indice_linha = df_consolidado.index[df_consolidado['CODIGO'] == current_codigo].tolist()[0]
              df_consolidado.loc[indice_linha, 'CARACTERISTICAS'].append(caracteristica[0])
          else:
              df_consolidado.append(row, ignore_index=True)


dataset_sicro = df_consolidado.groupby(['CODIGO', 'DESCRICAO'])['CARACTERISTICAS'].agg(combinar_arrays).reset_index()
dataset_sicro[['CARACTERISTICAS_DESONERADO', 'CARACTERISTICAS_NAO_DESONERADO']] = dataset_sicro.apply(separar_caracteristicas, axis=1)
dataset_sicro = dataset_sicro[['CODIGO', 'DESCRICAO', 'CARACTERISTICAS_DESONERADO', 'CARACTERISTICAS_NAO_DESONERADO']]

model_all_mini = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
dataset_sicro['ALL_MINI_BASE_VECTOR'] = dataset_sicro['DESCRICAO'].apply(lambda x: model_all_mini.encode(x))

print(dataset_sicro.head())

ELASTIC_PASSWORD = "elastic"
es = Elasticsearch(hosts="http://172.20.12.110:9200/", basic_auth=("elastic", "mkYozxvG9TEhWd8"))

body_sicro = {
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
                "type": "text",
                "analyzer": "rebuilt_brazilian"
            },
            "CARACTERISTICAS_DESONERADO": {
                "type": "nested",
                "properties": {
                    "MES_COLETA": {"type": "text"},
                    "DESONERADO": {"type": "boolean"},
                    "UNIDADE_MEDIDA": {"type": "text"},
                    "PRECO": {"type": "float"},
                    "VALOR_AQUISICAO": {"type": "float"},
                    "DEPRECIACAO": {"type": "float"},
                    "OPORTUNIDADE_CAPITAL": {"type": "float"},
                    "SEGUROS_IMPOSTOS": {"type": "float"},
                    "MANUTENCAO": {"type": "float"},
                    "OPERACAO": {"type": "float"},
                    "MAO_OBRA_OPERACAO": {"type": "float"},
                    "CUSTO_PRODUTIVO": {"type": "float"},
                    "CUSTO_IMPRODUTIVO": {"type": "float"},
                    "SALARIO": {"type": "float"},
                    "ENCARGOS_TOTAIS": {"type": "float"},
                    "CUSTO": {"type": "float"},
                    "PERICULOSIDADE_INSALUBRIDADE": {"type": "text"}
                }
            },
            "CARACTERISTICAS_NAO_DESONERADO": {
                "type": "nested",
                "properties": {
                    "MES_COLETA": {"type": "text"},
                    "DESONERADO": {"type": "boolean"},
                    "UNIDADE_MEDIDA": {"type": "text"},
                    "PRECO": {"type": "float"},
                    "VALOR_AQUISICAO": {"type": "float"},
                    "DEPRECIACAO": {"type": "float"},
                    "OPORTUNIDADE_CAPITAL": {"type": "float"},
                    "SEGUROS_IMPOSTOS": {"type": "float"},
                    "MANUTENCAO": {"type": "float"},
                    "OPERACAO": {"type": "float"},
                    "MAO_OBRA_OPERACAO": {"type": "float"},
                    "CUSTO_PRODUTIVO": {"type": "float"},
                    "CUSTO_IMPRODUTIVO": {"type": "float"},
                    "SALARIO": {"type": "float"},
                    "ENCARGOS_TOTAIS": {"type": "float"},
                    "CUSTO": {"type": "float"},
                    "PERICULOSIDADE_INSALUBRIDADE": {"type": "text"}
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

INDEX_NAME_SICRO = "sicro_index"

es.indices.delete(index=INDEX_NAME_SICRO, ignore=[400, 404])
es.indices.create(index=INDEX_NAME_SICRO, 
    settings=body_sicro["settings"],
    mappings=body_sicro["mappings"])

print(es.indices.exists(index=[INDEX_NAME_SICRO]))

dataset_sicro_dic = dataset_sicro.to_dict("records")

for record in dataset_sicro_dic:
    try:
        id_record = str(record["CODIGO"])
        es.index(index=INDEX_NAME_SICRO, document=record, id=id_record)
    except Exception as e:
        print(e)