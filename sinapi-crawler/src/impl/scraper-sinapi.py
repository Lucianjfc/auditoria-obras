import sys
import os
import os
import requests
import tqdm
import zipfile
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

class LinkInvalidoError(Exception):
    def __init__(self, message="O link fornecido é inválido."):
        self.message = message
        super().__init__(self.message)

def download(url: str, filename: str):
    try:
        with open(filename, 'wb') as f:
            with requests.get(url, stream=True) as r:
                r.raise_for_status()
                total = int(r.headers.get('content-length', 0))

                tqdm_params = {
                    'desc': url,
                    'total': total,
                    'miniters': 1,
                    'unit': 'B',
                    'unit_scale': True,
                    'unit_divisor': 1024,
                }
                with tqdm.tqdm(**tqdm_params) as pb:
                    for chunk in r.iter_content(chunk_size=8192):
                        pb.update(len(chunk))
                        f.write(chunk)
    except Exception:
        raise LinkInvalidoError(f"O link '{url}' não é válido.")

def extrair_arquivo_zip(caminho_arquivo_zip, diretorio_destino, desonerado):
    try:
        nome_pasta = os.path.splitext(os.path.basename(caminho_arquivo_zip))[0]
        if (desonerado):
            caminho_pasta = os.path.join(diretorio_destino + '/' + nome_pasta, 'desonerado')
            os.makedirs(caminho_pasta, exist_ok=True)
        else:
            caminho_pasta = os.path.join(diretorio_destino + '/' + nome_pasta, 'nao_desonerado')
            os.makedirs(caminho_pasta, exist_ok=True)
        with zipfile.ZipFile(caminho_arquivo_zip, 'r') as zip_ref:
            zip_ref.extractall(caminho_pasta)

        for root, dirs, files in os.walk(caminho_pasta):
            for file in files:
                arquivo_origem = os.path.join(root, file)
                arquivo_destino = os.path.join(caminho_pasta, file)
                os.replace(arquivo_origem, arquivo_destino)

        for root, dirs, files in os.walk(caminho_pasta, topdown=False):
            for nome_pasta in dirs:
                os.rmdir(os.path.join(root, nome_pasta))

    except (zipfile.BadZipFile, FileNotFoundError) as e:
        print(f"Erro ao extrair o arquivo ZIP: {e}")

class LinkSinapi:
    def __init__(self, link, ano, mes, desonerado):
        self.link = link
        self.ano = ano
        self.mes = mes
        self.desonerado = desonerado

url_desonerado = "https://www.caixa.gov.br/Downloads/sinapi-a-partir-jul-2009-pb/SINAPI_ref_Insumos_Composicoes_PB_data_Desonerado.zip"
url_nao_desonerado = "https://www.caixa.gov.br/Downloads/sinapi-a-partir-jul-2009-pb/SINAPI_ref_Insumos_Composicoes_PB_data_NaoDesonerado.zip"
url_desonerado_retificado = "https://www.caixa.gov.br/Downloads/sinapi-a-partir-jul-2009-pb/SINAPI_ref_Insumos_Composicoes_PB_data_Desonerado_Retificacao01.zip"
url_nao_desonerado_retificado = "https://www.caixa.gov.br/Downloads/sinapi-a-partir-jul-2009-pb/SINAPI_ref_Insumos_Composicoes_PB_data_NaoDesonerado_Retificacao01.zip"

links = []

year = 2023
meses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
ano_atual = datetime.now().year

for i in range(2023, ano_atual + 1):
    for mes in meses:
        current_link_desonerado1 = url_desonerado.replace("data", str(i)+mes)
        current_link_nao_desonerado1 = url_nao_desonerado.replace("data", str(i)+mes)
        current_link_desonerado2 = url_desonerado.replace("data", mes+str(i))
        current_link_nao_desonerado2 = url_nao_desonerado.replace("data", mes+str(i))
        current_link_desonerado3 = url_desonerado_retificado.replace("data", str(i)+mes)
        current_link_nao_desonerado3 = url_nao_desonerado_retificado.replace("data", str(i)+mes)
        current_link_desonerado4 = url_desonerado_retificado.replace("data", mes+str(i))
        current_link_nao_desonerado4 = url_nao_desonerado_retificado.replace("data", mes+str(i))
        link_sinapi1 = LinkSinapi(current_link_desonerado1, str(i), mes, True)
        link_sinapi2 = LinkSinapi(current_link_nao_desonerado1, str(i), mes, False)
        link_sinapi3 = LinkSinapi(current_link_desonerado2, str(i), mes, True)
        link_sinapi4 = LinkSinapi(current_link_nao_desonerado2, str(i), mes, False)
        link_sinapi5 = LinkSinapi(current_link_desonerado3, str(i), mes, True)
        link_sinapi6 = LinkSinapi(current_link_nao_desonerado3, str(i), mes, False)
        link_sinapi7 = LinkSinapi(current_link_desonerado4, str(i), mes, True)
        link_sinapi8 = LinkSinapi(current_link_nao_desonerado4, str(i), mes, False)

        links.append(link_sinapi1)
        links.append(link_sinapi2)
        links.append(link_sinapi3)
        links.append(link_sinapi4)
        links.append(link_sinapi5)
        links.append(link_sinapi6)
        links.append(link_sinapi7)
        links.append(link_sinapi8)

diretorio_destino = "/home/lucian/Documentos/obras-cost-audit/sinapi-crawler/SINAPI"

def renomear_arquivos_com_extensoes_minusculas(diretorio):
    print('diretorio:', diretorio)
    for raiz, subdiretorios, arquivos in os.walk(diretorio):
        for arquivo in arquivos:
            nome_arquivo, extensao = os.path.splitext(arquivo)
            if extensao.lower() != extensao:
                novo_nome = nome_arquivo + extensao.lower()
                caminho_atual = os.path.join(raiz, arquivo)
                novo_caminho = os.path.join(raiz, novo_nome)
                os.rename(caminho_atual, novo_caminho)

for link in links:
    nome_arquivo = f"{link.ano}{link.mes}.zip"
    caminho_arquivo = os.path.join(diretorio_destino, nome_arquivo)

    try:
        download(link.link, caminho_arquivo)
        extrair_arquivo_zip(caminho_arquivo, diretorio_destino, link.desonerado)
        renomear_arquivos_com_extensoes_minusculas(diretorio_destino)
    except (LinkInvalidoError) as e:
        print(e.message)

for arquivo in os.listdir(diretorio_destino):
    if arquivo.endswith(".zip"):
        caminho_arquivo = os.path.join(diretorio_destino, arquivo)
        os.remove(caminho_arquivo)
print("Arquivos .zip removidos com sucesso.")
