package br.gov.obras.dtos.requests;

import br.gov.obras.dtos.requests.advancedSearch.AdvancedSearchRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class CatalogoObraRequest extends AbstractFiltroRequest {
    private String search;
    private List<CatalogoObraFilterRequest> filters;

    public AdvancedSearchRequest toAdvancedSearchRequest() {
        AdvancedSearchRequest filters = new AdvancedSearchRequest(new ArrayList<>(), new ArrayList<>());
        filters.setPage(this.getPage());
        filters.setSort(this.getSort());
        filters.setFilterType(this.getFilterType());
        return filters;
    }
}
