package br.gov.obras.services;

import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.entities.ArquivoIdentificavel;

import java.util.List;

public interface ArquivoUploadService<A extends ArquivoIdentificavel, F extends AbstractFiltroRequest> extends IService<A, F> {

    List<A> buscarPor(Long idEntity);

}
