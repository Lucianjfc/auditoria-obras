package br.gov.obras.services;

import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.entities.ArquivoTipo;
import br.gov.obras.entities.enums.TipoArquivo;

public interface ArquivoUploadTipoService<A extends ArquivoTipo<EA>, F extends AbstractFiltroRequest, EA extends TipoArquivo> extends ArquivoUploadService<A, F> {

}
