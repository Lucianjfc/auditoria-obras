package br.gov.ac.tce.licon.dtos.mapper;

public interface EntityToDtoMapper<S, T> {

	default T map(S source) {
		throw new UnsupportedOperationException();
	}

	default void map(S source, T target) {
		throw new UnsupportedOperationException();
	}
	
}
