package br.gov.ac.tce.licon.entities;

import br.gov.ac.tce.licon.entities.enums.StatusCatalogo;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class AbstractSituacaoIdentificavel extends AbstractIdentificavel {

    @Column(name = "ID_USUARIO_CADASTRO")
    private Long idUsuarioCadastro;

    @Column(name = "DATA_CADASTRO")
    private LocalDateTime dataCadastro;

    @Column(name = "ID_USUARIO_ULTIMA_ALTERACAO")
    private Long idUsuarioUltimaAlteracao;

    @Column(name = "DATA_ULTIMA_ALTERACAO")
    private LocalDateTime dataUltimaAlteracao;

    @Column(name = "ID_USUARIO_EXCLUSAO")
    private Long idUsuarioExclusao;

    @Column(name = "DATA_EXCLUSAO")
    private LocalDateTime dataExclusao;

    @Column(name = "STATUS", nullable = false, columnDefinition = "NVARCHAR(255)")
    @Enumerated(value = EnumType.STRING)
    private StatusCatalogo status;

}
