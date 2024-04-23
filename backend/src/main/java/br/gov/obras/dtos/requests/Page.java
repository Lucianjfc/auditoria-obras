package br.gov.obras.dtos.requests;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class Page {
	
	@NotNull
	@Min(1)
	private Integer index;
	
	@NotNull
	@Min(1)
	private Integer size;

}
