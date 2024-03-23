package br.gov.ac.tce.licon.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ObrigatoriedadeArquivosRequestDTO {

    private String tipoProcesso;
    private List<String> filtros;
}
