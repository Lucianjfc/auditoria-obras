package br.gov.obras.entities;

import br.gov.obras.entities.enums.TipoArquivo;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class ArquivoTipo<EA extends TipoArquivo> extends ArquivoIdentificavel {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO")
    private EA tipo;

}
