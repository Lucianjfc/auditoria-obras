package br.gov.obras.services;

import br.gov.obras.dtos.requests.ArquivoRelatorioObraDTO;
import br.gov.obras.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.obras.entities.ArquivoRelatorioObra;
import br.gov.obras.entities.RelatorioObra;
import br.gov.obras.entities.enums.TipoArquivoRelatorioObra;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface RelatorioObraService extends AbstractUploadTipoService<RelatorioObra, RelatorioObraFiltroRequest, ArquivoRelatorioObraDTO, TipoArquivoRelatorioObra, ArquivoRelatorioObra> {

    void importarRelatorio(RelatorioObra relatorioObra, List<ArquivoRelatorioObraDTO> arquivos);
}
