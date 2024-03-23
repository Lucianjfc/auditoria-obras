package br.gov.ac.tce.licon.dtos.requests;

import java.time.LocalDateTime;

import javax.validation.Valid;

import br.gov.ac.tce.licon.dtos.ArquivoDTO;
import lombok.Data;

@Data
public abstract class ArquivoMappedSuperclassDTO {

    private Long idArquivo;

    private String descricao;

    private LocalDateTime dataEnvio;

    @Valid
    private ArquivoDTO arquivo;

}
