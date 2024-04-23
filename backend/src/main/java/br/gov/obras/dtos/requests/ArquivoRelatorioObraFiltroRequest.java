package br.gov.obras.dtos.requests;

import br.gov.obras.entities.RelatorioObra;
import br.gov.obras.entities.enums.TipoArquivoRelatorioObra;
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
