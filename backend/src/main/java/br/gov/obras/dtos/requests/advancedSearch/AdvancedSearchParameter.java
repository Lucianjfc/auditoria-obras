package br.gov.obras.dtos.requests.advancedSearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdvancedSearchParameter {

    private String field;
    private SearchOperator operator;
    private Object value;
    private List<Object> values;

    public AdvancedSearchParameter(String field, SearchOperator operator, Object value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
}
