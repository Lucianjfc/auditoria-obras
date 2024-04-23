package br.gov.obras.dtos.responses;

import br.gov.obras.entities.elastic.SicroElastic;
import lombok.Data;

import java.util.List;

@Data
public class SicroResponse {
    private List<SicroElastic> response;

}
