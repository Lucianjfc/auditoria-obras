package br.gov.ac.tce.licon.dtos.responses;

import br.gov.ac.tce.licon.entities.elastic.SicroElastic;
import lombok.Data;

import java.util.List;

@Data
public class SicroResponse {
    private List<SicroElastic> response;

}
