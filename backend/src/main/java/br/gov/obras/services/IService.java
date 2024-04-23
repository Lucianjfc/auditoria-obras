package br.gov.obras.services;

import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.dtos.responses.BuscaResponse;
import br.gov.obras.entities.AbstractIdentificavel;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.dtos.requests.advancedSearch.AdvancedSearchRequest;

import java.util.List;

public interface IService<E extends AbstractIdentificavel, F extends AbstractFiltroRequest> {

	E getById(Long id) throws AppException;

	E save(E entity) throws AppException;

	BuscaResponse<E> buscar(F filtro) throws AppException;

	BuscaResponse<E> buscarAdvanced(AdvancedSearchRequest filtro) throws AppException;

	List<E> buscarAllAdvanced(AdvancedSearchRequest filtro) throws AppException;

	void remover(Long id) throws AppException;

	List<E> getAll() throws AppException;

	List<E> getAllSort(F filtro) throws AppException;

	void checarSeJahExiste(E entity) throws AppException;
}
