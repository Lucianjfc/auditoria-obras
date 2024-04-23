package br.gov.obras.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CONFIGURACAO_ARQUIVO")
@AttributeOverride(name = "id", column = @Column(name = "ID_CONFIGURACAO_ARQUIVO"))
public class ConfiguracaoArquivo extends AbstractIdentificavel {

    @NotNull
    @Column(name = "TIPO_PROCESSO")
    private String tipoProcesso;

    @NotNull
    @Column(name = "OBRIGATORIEDADE")
    private Boolean obrigatoriedade;

    @ManyToOne(targetEntity = ObrigatoriedadeArquivo.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_OBRIGATORIEDADE_ARQUIVO")
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    @JsonBackReference(value = "configuracoesArquivo")
    private ObrigatoriedadeArquivo obrigatoriedadeArquivo;

    @OneToMany(mappedBy = "configuracaoArquivo", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    @JsonManagedReference(value = "filtroArquivo")
    private List<FiltroArquivo> filtros;

}
