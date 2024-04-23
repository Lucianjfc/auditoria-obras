package br.gov.obras.dtos.requests;

import br.gov.obras.entities.RelatorioObra;
import lombok.Data;

import java.util.List;

@Data
public class RelatorioObraDTO {

    private RelatorioObra relatorioObra;

    private List<ArquivoRelatorioObraDTO> arquivos;
}
