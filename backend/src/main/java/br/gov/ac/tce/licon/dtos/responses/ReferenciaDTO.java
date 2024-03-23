package br.gov.ac.tce.licon.dtos.responses;

import br.gov.ac.tce.licon.entities.elastic.SicroElastic;
import br.gov.ac.tce.licon.entities.elastic.SinapiElastic;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferenciaDTO {

    SicroElastic referenciaSicro;

    SinapiElastic referenciaSinapi;

}
