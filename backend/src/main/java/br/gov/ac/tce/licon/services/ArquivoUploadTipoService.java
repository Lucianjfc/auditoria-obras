package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.entities.ArquivoTipo;
import br.gov.ac.tce.licon.entities.enums.TipoArquivo;

public interface ArquivoUploadTipoService<A extends ArquivoTipo<EA>, F extends AbstractFiltroRequest, EA extends TipoArquivo> extends ArquivoUploadService<A, F> {

}
