package br.gov.ac.tce.licon.dtos.responses;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FailureResponse {

	private Integer code;
	
	private List<String> messages;
	
	private String stackTrace;
	
}
