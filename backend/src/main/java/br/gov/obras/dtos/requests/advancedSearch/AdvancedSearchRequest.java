package br.gov.obras.dtos.requests.advancedSearch;

import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class AdvancedSearchRequest extends AbstractFiltroRequest {
    private List<AdvancedSearchParameter> andParameters;
    private List<AdvancedSearchParameter> orParameters;
}
