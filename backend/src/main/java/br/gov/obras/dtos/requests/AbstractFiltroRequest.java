package br.gov.obras.dtos.requests;

import br.gov.obras.dtos.AbstractDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public abstract class AbstractFiltroRequest extends AbstractDTO {

    private SortBy sort = new SortBy();
    private FilterType filterType;
    private Page page;
}
