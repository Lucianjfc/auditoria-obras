package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.dtos.responses.BuscaResponse;
import br.gov.ac.tce.licon.entities.AbstractIdentificavel;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.dtos.requests.advancedSearch.AdvancedSearchRequest;

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
