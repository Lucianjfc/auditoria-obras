package br.gov.obras.dtos.requests;
import br.gov.obras.entities.enums.TipoArquivo;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ArquivoUploadDTO<EA extends TipoArquivo> extends ArquivoMappedSuperclassDTO {

    private EA tipo;

}
