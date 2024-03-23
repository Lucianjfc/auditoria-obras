package br.gov.ac.tce.licon.entities.elastic;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Data
@EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "material_index")
public class MaterialElastic {

    @Id
    private Long id;

    @Field(type = FieldType.Float, name = "SCORE")
    private Float score;

    @Field(type = FieldType.Keyword, name = "TIPO")
    private String tipo;

    @Field(type = FieldType.Text, name = "CODIGO_MATERIAL")
    private String codigo;

    @Field(type = FieldType.Text, name = "ITEM_SUSPENSO")
    private String itemSuspenso;

    @Field(type = FieldType.Text, name = "MATERIAL_SUSTENTAVEL")
    private String materialSustentavel;

    @Field(type = FieldType.Text, name = "NOME_MATERIAL")
    private String nomeMaterial;

    @Field(type = FieldType.Text, name = "MATERIAL_TEXT")
    private String materialText;

    @Field(type = FieldType.Keyword, name = "CODIGO_CLASSE")
    private String codigoClasse;

    @Field(type = FieldType.Keyword, name = "DESCRICAO_CLASSE")
    private String descricaoClasse;

    @Field(type = FieldType.Keyword, name = "CODIGO_SUBCLASSE")
    private String codigoSubclasse;

    @Field(type = FieldType.Keyword, name = "DESCRICAO_SUBCLASSE")
    private String descricaoSubclasse;

    @Field(type = FieldType.Keyword, name = "CODIGO_GRUPO")
    private String codigoGrupo;

    @Field(type = FieldType.Keyword, name = "DESCRICAO_GRUPO")
    private String descricaoGrupo;

    @Field(type = FieldType.Keyword, name = "CODIGO_DIVISAO")
    private String codigoDivisao;

    @Field(type = FieldType.Keyword, name = "DESCRICAO_DIVISAO")
    private String descricaoDivisao;

    @Field(type = FieldType.Keyword, name = "CODIGO_SECAO")
    private String codigoSecao;

    @Field(type = FieldType.Keyword, name = "DESCRICAO_SECAO")
    private String descricaoSecao;

    @Field(type = FieldType.Nested, name = "CARACTERISTICAS")
    private List<Caracteristica> caracteristicas;

}
