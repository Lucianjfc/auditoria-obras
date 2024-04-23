package br.gov.obras.dtos.requests;

import br.gov.obras.entities.AbstractIdentificavel_;
import lombok.Data;

@Data
public class SortBy {

	private static final String DEFAULT_SORT_BY = AbstractIdentificavel_.ID;
	
	private static final SortOrder DEFAULT_SORT_ORDER = SortOrder.asc;

	private String by = DEFAULT_SORT_BY;
	
	private SortOrder order = DEFAULT_SORT_ORDER;

}
