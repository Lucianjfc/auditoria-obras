package br.gov.obras.services;

import br.gov.obras.dtos.requests.ArquivoRelatorioObraFiltroRequest;
import br.gov.obras.entities.ArquivoRelatorioObra;
import br.gov.obras.entities.enums.TipoArquivoRelatorioObra;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ArquivoRelatorioObraService extends ArquivoUploadTipoService<ArquivoRelatorioObra, ArquivoRelatorioObraFiltroRequest, TipoArquivoRelatorioObra> {

    List<ArquivoRelatorioObra> buscarPor(Long idRelatorioObra);

}
