package br.gov.obras.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "FILTRO_ARQUIVO")
@AttributeOverride(name = "id", column = @Column(name = "ID_FILTRO_ARQUIVO"))
public class FiltroArquivo extends AbstractIdentificavel {

    @NotNull
    @Column(name = "FILTRO")
    private String filtro;

    @ManyToOne(targetEntity = ConfiguracaoArquivo.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONFIGURACAO_ARQUIVO")
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    @JsonBackReference(value = "filtroArquivo")
    private ConfiguracaoArquivo configuracaoArquivo;

}
