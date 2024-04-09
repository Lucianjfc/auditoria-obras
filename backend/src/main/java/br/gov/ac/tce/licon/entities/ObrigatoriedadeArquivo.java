package br.gov.ac.tce.licon.entities;

import br.gov.ac.tce.licon.entities.enums.Objeto;
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
@Table(name = "OBRIGATORIEDADE_ARQUIVO")
@AttributeOverride(name = "id", column = @Column(name = "ID_OBRIGATORIEDADE_ARQUIVO"))
public class ObrigatoriedadeArquivo extends AbstractIdentificavel {

    public ObrigatoriedadeArquivo(Objeto objeto, Boolean obrigatorio, String arquivo, String arquivoEnum, Boolean exibirPortal, Boolean exibirPrimeiraFase, Boolean obrigatorioAntigo) {
        this.objeto = objeto;
        this.obrigatorio = obrigatorio;
        this.arquivo = arquivo;
        this.arquivoEnum = arquivoEnum;
        this.exibirPortal = exibirPortal;
        this.exibirPrimeiraFase = exibirPrimeiraFase;
        this.obrigatorioAntigo = obrigatorioAntigo;
    }
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "OBJETO")
    private Objeto objeto;

    @NotNull
    @Column(name = "OBRIGATORIO")
    private Boolean obrigatorio;

    @NotNull
    @Column(name = "ARQUIVO")
    private String arquivo;

    @Column(name = "ARQUIVO_ENUM")
    private String arquivoEnum;

    @Column(name = "EXIBIR_PORTAL")
    private Boolean exibirPortal;

    @Column(name = "EXIBIR_PRIMEIRA_FASE")
    private Boolean exibirPrimeiraFase;

    @NotNull
    @Column(name = "OBRIGATORIO_ANTIGO")
    private Boolean obrigatorioAntigo;

    @OneToMany(mappedBy = "obrigatoriedadeArquivo", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    @JsonManagedReference(value = "configuracoesArquivo")
    private List<ConfiguracaoArquivo> configuracoesArquivo;

}
