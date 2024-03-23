package br.gov.ac.tce.licon.dtos.requests;

import br.gov.ac.tce.licon.entities.RelatorioObra;
import lombok.Data;

import java.util.List;

@Data
public class RelatorioObraDTO {

    private RelatorioObra relatorioObra;

    private List<ArquivoRelatorioObraDTO> arquivos;
}
