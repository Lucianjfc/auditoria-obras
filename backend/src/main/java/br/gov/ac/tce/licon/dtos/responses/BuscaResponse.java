package br.gov.ac.tce.licon.dtos.responses;

import lombok.Data;

import java.util.List;

@Data
public class BuscaResponse<T> {
    
    private long total;

    private List<T> items;
}
