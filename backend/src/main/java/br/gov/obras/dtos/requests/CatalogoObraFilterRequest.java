package br.gov.obras.dtos.requests;

import lombok.Data;

@Data
public class CatalogoObraFilterRequest {

    private String field;
    private String value;

}
