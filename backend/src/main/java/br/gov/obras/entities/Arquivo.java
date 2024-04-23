package br.gov.obras.entities;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class Arquivo extends AbstractIdentificavel {

    @NotNull
    @Column(name = "DIRETORIO")
    protected String diretorio;

    @NotNull
    @Column(name = "NOME")
    protected String nome;

    @Column(name = "TIPO_ARQUIVO")
    protected String tipoArquivo;

    @Column(name = "DESCRICAO")
    protected String descricao;

    @Column(name = "DATA_ENVIO")
    protected LocalDateTime dataEnvio;

}
