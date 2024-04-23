package br.gov.obras.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.MappedSuperclass;

@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class ArquivoIdentificavel extends Arquivo {

    public abstract Long getIdEntidade();

}
