package br.gov.ac.tce.licon.dtos.requests;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum FilterType {
    FILTER("FILTER"),
    SEARCH("SEARCH");

    private String valor;

    FilterType(String valor) {
        this.valor = valor;
    }
}
