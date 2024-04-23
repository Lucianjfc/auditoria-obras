package br.gov.obras.services.impl;

import br.gov.obras.dtos.requests.ArquivoRelatorioObraFiltroRequest;
import br.gov.obras.entities.ArquivoRelatorioObra;
import br.gov.obras.repositories.ArquivoRelatorioObraRepository;
import br.gov.obras.services.ArquivoRelatorioObraService;
import br.gov.obras.services.specs.ArquivoRelatorioObraSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ArquivoRelatorioObraServiceImpl
        extends AbstractService<ArquivoRelatorioObra, ArquivoRelatorioObraFiltroRequest, ArquivoRelatorioObraRepository>
        implements ArquivoRelatorioObraService {

    @Autowired
    private ArquivoRelatorioObraRepository repository;

    @Override
    public ArquivoRelatorioObraRepository getRepository() {
        return repository;
    }

    @Override
    protected Specification<ArquivoRelatorioObra> getSpecification(ArquivoRelatorioObraFiltroRequest filtro) {
        return new ArquivoRelatorioObraSpecification(filtro);
    }

    @Override
    protected void beforeSave(ArquivoRelatorioObra entity) {
        if (entity.getId() == null) {
            entity.setDataEnvio(LocalDateTime.now());
        }
    }

    @Override
    public List<ArquivoRelatorioObra> buscarPor(Long idRelatorioObra) {
        return repository.buscarPor(idRelatorioObra);
    }
}
