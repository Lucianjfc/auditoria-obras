package br.gov.ac.tce.licon.dtos.requests;

import br.gov.ac.tce.licon.entities.enums.FaseLicitacao;
import br.gov.ac.tce.licon.entities.enums.Objeto;
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

    private Set<FaseLicitacao> fasesObrigatorias;
}
