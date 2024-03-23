package br.gov.ac.tce.licon.dtos.requests;

import br.gov.ac.tce.licon.entities.RelatorioObra;
import br.gov.ac.tce.licon.entities.enums.TipoArquivoRelatorioObra;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)
public class ArquivoRelatorioObraFiltroRequest extends AbstractFiltroRequest {

    private RelatorioObra relatorioObra;

    private TipoArquivoRelatorioObra tipoArquivoRelatorioObra;

    protected String diretorio;

    protected String nome;

    protected String tipoArquivo;

    protected String descricao;

    protected LocalDate dataEnvio;
}
