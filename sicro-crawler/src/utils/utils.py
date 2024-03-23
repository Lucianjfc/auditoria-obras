def mapperMesTitle(mes):
    if mes.lower() == 'marco':
        return 'Março'
    elif mes.lower() == 'janeiro':
        return 'Janeiro'
    elif mes.lower() == 'fevereiro':
        return 'Fevereiro'
    elif mes.lower() == 'marco':
        return 'Março'
    elif mes.lower() == 'abril':
        return 'Abril'
    elif mes.lower() == 'maio':
        return 'Maio'
    elif mes.lower() == 'junho':
        return 'Junho'
    elif mes.lower() == 'julho':
        return 'Julho'
    elif mes.lower() == 'agosto':
        return 'Agosto'
    elif mes.lower() == 'setembro':
        return 'Setembro'
    elif mes.lower() == 'outubro':
        return 'Outubro'
    elif mes.lower() == 'novembro':
        return 'Novembro'
    elif mes.lower() == 'dezembro':
        return 'Dezembro'
    else:
        return mes.capitalize()
    
def mapperMes(mes):
    if 'janeiro' in mes.lower():
        return 'janeiro'
    elif 'fevereiro' in mes.lower():
        return 'fevereiro'
    elif 'marco' in mes.lower():
        return 'marco'
    elif 'abril' in mes.lower():
        return 'abril'
    elif 'maio' in mes.lower():
        return 'maio'
    elif 'junho' in mes.lower():
        return 'junho'
    elif 'julho' in mes.lower():
        return 'julho'
    elif 'agosto' in mes.lower():
        return 'agosto'
    elif 'setembro' in mes.lower():
        return 'setembro'
    elif 'outubro' in mes.lower():
        return 'outubro'
    elif 'novembro' in mes.lower():
        return 'novembro'
    elif 'dezembro' in mes.lower():
        return 'dezembro'
    else:
        return mes.capitalize()

def mapperMesNumber(mes):
    meses = {
        'janeiro': '01',
        'fevereiro': '02',
        'março': '03',
        'abril': '04',
        'maio': '05',
        'junho': '06',
        'julho': '07',
        'agosto': '08',
        'setembro': '09',
        'outubro': '10',
        'novembro': '11',
        'dezembro': '12'
    }
    mes = mes.lower().strip()
    return meses.get(mes)