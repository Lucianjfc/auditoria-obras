package br.gov.obras.entities.elastic;

import lombok.*;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaracteristicaSinapiElastic {

    @Field(type = FieldType.Text, name = "UNIDADE_MEDIDA")
    private String unidadeMedida;

    @Field(type = FieldType.Text, name = "ORIGEM_PRECO")
    private String origemPreco;

    @Field(type = FieldType.Text, name = "PRECO_MEDIANO")
    private String precoMediano;

    @Field(type = FieldType.Text, name = "MES_COLETA")
    private String mesColeta;

    @Field(type = FieldType.Boolean, name = "DESONERADO")
    private Boolean desonerado;

}

