import sys
import os
import os
import requests
from bs4 import BeautifulSoup
import tqdm
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from utils.utils import mapperMes, mapperMesTitle, mapperMesNumber

class LinkSicro:
    def __init__(self, link, ano, mes, mesTitle):
        self.link = link
        self.ano = ano
        self.mes = mes
        self.mesTitle = mesTitle

url = "https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/custos-e-pagamentos/custos-e-pagamentos-dnit/sistemas-de-custos/sicro_antiga/norte/norte"

headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"}

site = requests.get(url, headers=headers)
soup = BeautifulSoup(site.content, 'html.parser')
items = soup.find_all('div', id='parent-fieldname-text')

links_extraidos = []

if items:
    for item in items:
        links = item.find_all('a', class_='internal-link')
        for link in links:
            link_href = link['href']
            if 'acre' in link_href:
                links_extraidos.append(link_href)
else:
    print('Nenhum item encontrado.')

links_sicro = [] 
for link in links_extraidos:
    partes_link = link.split('/')

    ano = partes_link[-3]
    mes = mapperMes(partes_link[-2])
    mesTitle = mapperMesTitle(mes)

    link_sicro = LinkSicro(link, ano, mes, mesTitle)
    links_sicro.append(link_sicro)

def download(url: str, filename: str):
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


diretorio_destino = "/home/lucian/Documentos/obras-cost-audit/SICRO"

for link_sicro in links_sicro:
    if (int(link_sicro.ano) >= 2023):
        response = requests.get(link_sicro.link, stream=True)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')

            link_tag = soup.find('a', text=f"{link_sicro.mes.title()}/{link_sicro.ano}")

            if link_tag:
                url_arquivo = link_tag['href']

                nome_arquivo = f"{link_sicro.ano}{mapperMesNumber(link_sicro.mes)}.zip"

                caminho_arquivo = os.path.join(diretorio_destino, nome_arquivo)

                download(url_arquivo, caminho_arquivo)
        else:
            print(f"Não foi possível acessar o link: {link_sicro.link}")
