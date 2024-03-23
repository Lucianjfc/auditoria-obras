package br.gov.ac.tce.licon.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
	
	public AppException(String message) {
		super(message);
	}

	public AppException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public AppException(String message, HttpStatus httpStatus) {
		super(message);
		this.httpStatus = httpStatus;
	}

}
