package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.entities.ArquivoRelatorioObra;
import br.gov.ac.tce.licon.repositories.ArquivoRelatorioObraRepository;
import br.gov.ac.tce.licon.services.ArquivoRelatorioObraService;
import br.gov.ac.tce.licon.services.specs.ArquivoRelatorioObraSpecification;
import com.j256.simplemagic.ContentType;
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
