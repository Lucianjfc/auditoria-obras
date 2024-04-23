package br.gov.obras.dtos.requests;

import br.gov.obras.entities.enums.Objeto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = false)
public class ObrigatoriedadeArquivoFiltroRequest extends AbstractFiltroRequest {

    private Objeto objeto;

    private Boolean obrigatorio;

    private String arquivo;

    private Boolean exibirPortal;

    private Boolean exibirPrimeiraFase;

    private Set<String> modalidades;

}
