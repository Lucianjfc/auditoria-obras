package br.gov.ac.tce.licon.dtos.requests.advancedSearch;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum SearchOperator {
    EQUAL_TO("EQUAL_TO", "="),
    NOT_EQUAL_TO("NOT_EQUAL_TO", "<>"),
    CONTAINS("CONTAINS", "LIKE"),
    IS_NULL("IS_NULL", "IS NULL"),
    IS_NOT_NULL("IS_NOT_NULL", "IS NOT NULL"),
    GREATER_THAN("GREATER_THAN", ">"),
    GREATER_THAN_EQUAL("GREATER_THAN_EQUAL", ">="),
    LESSER_THAN("LESSER_THAN", "<"),
    LESSER_THAN_EQUAL("LESSER_THAN_EQUAL", "<="),
    HORIZONTAL_ENTITY_FILTER("HORIZONTAL_ENTITY_FILTER", "HORIZONTAL_ENTITY_FILTER"),
    NOT_IN("NOT_IN", "NOT IN"),
    IN("IN", "IN");

    private String valor;
    private String sqlString;

    SearchOperator(String valor, String sqlString) {
        this.valor = valor;
        this.sqlString = sqlString;
    }
}
