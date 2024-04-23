package br.gov.obras.services.impl;

import br.gov.obras.dtos.requests.ObrigatoriedadeArquivoFiltroRequest;
import br.gov.obras.entities.ObrigatoriedadeArquivo;
import br.gov.obras.entities.enums.Objeto;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.repositories.ObrigatoriedadeArquivoRepository;
import br.gov.obras.services.ObrigatoriedadeArquivoService;
import br.gov.obras.services.specs.ObrigatoriedadeArquivoSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ObrigatoriedadeArquivoServiceImpl extends AbstractService<ObrigatoriedadeArquivo, ObrigatoriedadeArquivoFiltroRequest, ObrigatoriedadeArquivoRepository> implements ObrigatoriedadeArquivoService {

    @Autowired
    private ObrigatoriedadeArquivoRepository repository;

    @Override
    public ObrigatoriedadeArquivoRepository getRepository() {
        return repository;
    }

    @Override
    protected Example<ObrigatoriedadeArquivo> obterExemploChecarSeJahExiste(ObrigatoriedadeArquivo entity) throws AppException {
        ObrigatoriedadeArquivo exemplo = ObrigatoriedadeArquivo.builder().arquivo(entity.getArquivo()).objeto(entity.getObjeto()).build();
        return Example.of(exemplo);
    }

    @Override
    protected void lancarErroEntidadeJahExistente(ObrigatoriedadeArquivo entity) throws AppException {
        throw new AppException(String.format("Obrigatoriedade de arquivo com objeto e arquivo já existe: %s", entity.getObjeto() + " " + entity.getArquivo()),
                HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Override
    protected Specification<ObrigatoriedadeArquivo> getSpecification(ObrigatoriedadeArquivoFiltroRequest filtro) {
        return new ObrigatoriedadeArquivoSpecification(filtro);
    }

    @Override
    public List<ObrigatoriedadeArquivo> getArquivosObrigatorios(String tipoProcesso, List<String> filtros) {
        List<Object[]> result = this.repository.getArquivosObrigatorios(tipoProcesso, filtros, Long.valueOf(filtros.size()));
        return result.stream()
                .map(obrigatoriedade -> new ObrigatoriedadeArquivo(
                        Objeto.valueOf((String) obrigatoriedade[0]),
                        (Boolean) obrigatoriedade[1],
                        (String) obrigatoriedade[2],
                        (String) obrigatoriedade[3],
                        (Boolean) obrigatoriedade[4],
                        (Boolean) obrigatoriedade[5],
                        (Boolean) obrigatoriedade[6]
                ))
                .collect(Collectors.toList());
    }
}
