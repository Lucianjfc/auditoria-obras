package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.entities.ArquivoIdentificavel;

import java.util.List;

public interface ArquivoUploadService<A extends ArquivoIdentificavel, F extends AbstractFiltroRequest> extends IService<A, F> {

    List<A> buscarPor(Long idEntity);

}
