package br.gov.ac.tce.licon.entities.elastic;

import lombok.*;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Caracteristica {

    @Field(type = FieldType.Text, name = "CARACTERISTICA")
    private String caracteristica;

}

