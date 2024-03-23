package br.gov.ac.tce.licon.entities;

import br.gov.ac.tce.licon.dtos.responses.ReferenciaDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ITEM_OBRA")
@AttributeOverride(name = "id", column = @Column(name = "ID_ITEM_OBRA"))
public class ItemObra extends AbstractIdentificavel {

    @Column(name = "CODIGO")
    private String codigo;

    @Column(name = "FONTE")
    private String fonte;

    @Column(name = "QUANTIDADE")
    private Integer quantidade;

    @Column(name = "PRECO_UNITARIO")
    private BigDecimal precoUnitario;

    @Column(name = "MES_COLETA")
    private String mesColeta;

    @Column(name = "DESONERADO")
    private Boolean desonerado;

    @Column(name = "IMPORTADO")
    private Boolean importado;

    @Column(name = "SCORE")
    private BigDecimal score;

    @Transient
    private String descricao;

    @NotNull
    @ManyToOne(targetEntity = RelatorioObra.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RELATORIO_OBRA")
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    @JsonBackReference(value = "itensObra")
    private RelatorioObra relatorioObra;

    @Transient
    private ReferenciaDTO referencia;

}
