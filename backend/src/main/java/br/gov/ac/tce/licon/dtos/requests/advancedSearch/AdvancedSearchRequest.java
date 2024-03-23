package br.gov.ac.tce.licon.dtos.requests.advancedSearch;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
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
