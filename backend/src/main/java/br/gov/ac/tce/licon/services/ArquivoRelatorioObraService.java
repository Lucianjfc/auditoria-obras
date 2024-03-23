package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.entities.ArquivoRelatorioObra;
import br.gov.ac.tce.licon.entities.enums.TipoArquivoRelatorioObra;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ArquivoRelatorioObraService extends ArquivoUploadTipoService<ArquivoRelatorioObra, ArquivoRelatorioObraFiltroRequest, TipoArquivoRelatorioObra> {

    List<ArquivoRelatorioObra> buscarPor(Long idRelatorioObra);

}
