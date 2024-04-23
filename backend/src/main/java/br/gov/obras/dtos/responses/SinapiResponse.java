package br.gov.obras.dtos.responses;

import br.gov.obras.entities.elastic.SinapiElastic;
import lombok.Data;
import java.util.List;

@Data
public class SinapiResponse {
    private List<SinapiElastic> response;

}
