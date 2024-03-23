package br.gov.ac.tce.licon.entities.elastic;

import lombok.*;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaracteristicaSicroElastic {

    @Field(type = FieldType.Text, name = "MES_COLETA")
    private String mesColeta;

    @Field(type = FieldType.Boolean, name = "DESONERADO")
    private Boolean desonerado;

    @Field(type = FieldType.Text, name = "UNIDADE_MEDIDA")
    private String unidadeMedida;

    @Field(type = FieldType.Float, name = "PRECO")
    private Float preco;

    @Field(type = FieldType.Float, name = "VALOR_AQUISICAO")
    private Float valorAquisicao;

    @Field(type = FieldType.Float, name = "DEPRECIACAO")
    private Float depreciacao;

    @Field(type = FieldType.Float, name = "OPORTUNIDADE_CAPITAL")
    private Float oportunidadeCapital;

    @Field(type = FieldType.Float, name = "SEGUROS_IMPOSTOS")
    private Float segurosImpostos;

    @Field(type = FieldType.Float, name = "MANUTENCAO")
    private Float manutencao;

    @Field(type = FieldType.Float, name = "OPERACAO")
    private Float operacao;

    @Field(type = FieldType.Float, name = "MAO_OBRA_OPERACAO")
    private Float maoObraOperacao;

    @Field(type = FieldType.Float, name = "CUSTO_PRODUTIVO")
    private Float custoProdutivo;

    @Field(type = FieldType.Float, name = "CUSTO_IMPRODUTIVO")
    private Float custoImprodutivo;

    @Field(type = FieldType.Float, name = "SALARIO")
    private Float salario;

    @Field(type = FieldType.Float, name = "ENCARGOS_TOTAIS")
    private Float encargosTotais;

    @Field(type = FieldType.Float, name = "CUSTO")
    private Float custo;

    @Field(type = FieldType.Text, name = "PERICULOSIDADE_INSALUBRIDADE")
    private String periculosidadeInsalubridade;

}

