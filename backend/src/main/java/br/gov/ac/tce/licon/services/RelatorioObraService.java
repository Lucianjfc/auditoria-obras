package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraDTO;
import br.gov.ac.tce.licon.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.entities.ArquivoRelatorioObra;
import br.gov.ac.tce.licon.entities.RelatorioObra;
import br.gov.ac.tce.licon.entities.enums.TipoArquivoRelatorioObra;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface RelatorioObraService extends AbstractUploadTipoService<RelatorioObra, RelatorioObraFiltroRequest, ArquivoRelatorioObraDTO, TipoArquivoRelatorioObra, ArquivoRelatorioObra> {

    void importarRelatorio(RelatorioObra relatorioObra, List<ArquivoRelatorioObraDTO> arquivos);
}
