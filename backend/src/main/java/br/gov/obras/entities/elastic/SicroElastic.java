package br.gov.obras.entities.elastic;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "sicro_index")
public class SicroElastic {
    @Id
    private String codigo;

    @Field(type = FieldType.Text, name = "DESCRICAO")
    private String descricao;

    @Field(type = FieldType.Float, name = "SCORE")
    private BigDecimal score;

    @Field(type = FieldType.Nested, name = "CARACTERISTICAS_NAO_DESONERADO")
    private List<CaracteristicaSicroElastic> caracteristicasNaoDesonerado;

    @Field(type = FieldType.Nested, name = "CARACTERISTICAS_DESONERADO")
    private List<CaracteristicaSicroElastic> caracteristicasDesonerado;

}
