package br.gov.ac.tce.licon.dtos.requests;
import br.gov.ac.tce.licon.entities.enums.TipoArquivo;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ArquivoUploadDTO<EA extends TipoArquivo> extends ArquivoMappedSuperclassDTO {

    private EA tipo;

}
