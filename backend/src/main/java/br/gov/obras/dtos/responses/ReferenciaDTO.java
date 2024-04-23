package br.gov.obras.dtos.responses;

import br.gov.obras.entities.elastic.SicroElastic;
import br.gov.obras.entities.elastic.SinapiElastic;
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
