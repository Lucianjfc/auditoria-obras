package br.gov.ac.tce.licon.dtos.responses;

import br.gov.ac.tce.licon.entities.elastic.SinapiElastic;
import lombok.Data;
import java.util.List;

@Data
public class SinapiResponse {
    private List<SinapiElastic> response;

}
