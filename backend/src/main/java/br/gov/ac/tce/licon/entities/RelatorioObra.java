package br.gov.ac.tce.licon.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "RELAT0RIO_OBRA")
@AttributeOverride(name = "id", column = @Column(name = "ID_RELATORIO_OBRA"))
public class RelatorioObra extends AbstractIdentificavel {


    @Column(name = "DATA_ANALISE")
    private LocalDateTime dataAnalise;

    @Column(name = "OBSERVACAO")
    private String observacao;

    @Column(name = "TITULO")
    private String titulo;

    @OneToMany(mappedBy = "relatorioObra", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler", "relatorioObra"}, allowSetters = true)
    @JsonManagedReference(value = "itensObra")
    private List<ItemObra> itensObra;

    @Column(name = "IMPORTADO")
    private Boolean importado;

}
