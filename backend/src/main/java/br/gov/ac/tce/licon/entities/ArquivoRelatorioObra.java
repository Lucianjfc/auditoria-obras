package br.gov.ac.tce.licon.entities;

import br.gov.ac.tce.licon.entities.enums.TipoArquivoRelatorioObra;
import lombok.*;

import javax.persistence.*;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ARQUIVO_RELATORIO_OBRA")
@AttributeOverride(name = "id", column = @Column(name = "ID_ARQUIVO_RELATORIO_OBRA"))
@AttributeOverride(name = "tipo", column = @Column(name = "TIPO_ARQUIVO_RELATORIO_OBRA"))
public class ArquivoRelatorioObra extends ArquivoTipo<TipoArquivoRelatorioObra> {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RELATORIO_OBRA")
    private RelatorioObra relatorioObra;

    @Override
    public Long getIdEntidade() {
        return relatorioObra.getId();
    }

}
