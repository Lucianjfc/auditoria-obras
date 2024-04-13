def obter_caracteristicas_sicro(caracteristicas):
    lista_caracteristicas = []
    for caracteristica in caracteristicas:
        nova_caracteristica = {
            "mesColeta": caracteristica.get("MES_COLETA"),
            "desonerado": caracteristica.get("DESONERADO"),
            "unidadeMedida": caracteristica.get("UNIDADE_MEDIDA"),
            "preco": caracteristica.get("PRECO"),
            "valorAquisicao": caracteristica.get("VALOR_AQUISICAO"),
            "depreciacao": caracteristica.get("DEPRECIACAO"),
            "oportunidadeCapital": caracteristica.get("OPORTUNIDADE_CAPITAL"),
            "segurosImpostos": caracteristica.get("SEGUROS_IMPOSTOS"),
            "manutencao": caracteristica.get("MANUTENCAO"),
            "operacao": caracteristica.get("OPERACAO"),
            "maoObraOperacao": caracteristica.get("MAO_OBRA_OPERACAO"),
            "custoProdutivo": caracteristica.get("CUSTO_PRODUTIVO"),
            "custoImprodutivo": caracteristica.get("CUSTO_IMPRODUTIVO"),
            "salario": caracteristica.get("SALARIO"),
            "encargosTotais": caracteristica.get("ENCARGOS_TOTAIS"),
            "custo": caracteristica.get("CUSTO"),
            "periculosidadeInsalubridade": caracteristica.get("PERICULOSIDADE_INSALUBRIDADE"),
        }
        lista_caracteristicas.append(nova_caracteristica)
    return lista_caracteristicas

def criar_novo_objeto_sicro(objeto):
    novo_objeto = {
        "score": objeto.get("_score"),
        "codigo": objeto["_source"].get("CODIGO"),
        "descricao": objeto["_source"].get("DESCRICAO"),
        "caracteristicasDesonerado": obter_caracteristicas_sicro(objeto["_source"].get("CARACTERISTICAS_DESONERADO", [])),
        "caracteristicasNaoDesonerado": obter_caracteristicas_sicro(objeto["_source"].get("CARACTERISTICAS_NAO_DESONERADO", []))
    }
    return novo_objeto


def obter_caracteristicas_sinapi(caracteristicas):
    lista_caracteristicas = []
    for caracteristica in caracteristicas:
        nova_caracteristica = {
            "unidadeMedida": caracteristica.get("UNIDADE_MEDIDA"),
            "origemPreco": caracteristica.get("ORIGEM_PRECO"),
            "precoMediano": caracteristica.get("PRECO_MEDIANO"),
            "mesColeta": caracteristica.get("MES_COLETA"),
            "desonerado": caracteristica.get("DESONERADO"),
        }
        lista_caracteristicas.append(nova_caracteristica)
    return lista_caracteristicas


def criar_novo_objeto_sinapi(objeto):
    novo_objeto = {
        "score": objeto.get("_score"),
        "codigo": objeto["_source"].get("CODIGO"),
        "descricao": objeto["_source"].get("DESCRICAO"),
        "caracteristicasDesonerado": obter_caracteristicas_sinapi(objeto["_source"].get("CARACTERISTICAS_DESONERADO", [])),
        "caracteristicasNaoDesonerado": obter_caracteristicas_sinapi(objeto["_source"].get("CARACTERISTICAS_NAO_DESONERADO", []))
    }
    return novo_objeto