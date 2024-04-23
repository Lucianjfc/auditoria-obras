package br.gov.obras.services.impl;

import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.entities.AbstractIdentificavel;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.repositories.IRepository;
import org.springframework.http.HttpStatus;

public abstract class AbstractViewService<E extends AbstractIdentificavel, F extends AbstractFiltroRequest, R extends IRepository<E>> extends AbstractService<E, F, R> {

    @Override
    public E save(E entity) throws AppException {
        throw new AppException("Entidade não pode ser salva", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Override
    public void remover(Long id) throws AppException {
        throw new AppException("Entidade não pode ser removida", HttpStatus.UNPROCESSABLE_ENTITY);
    }

}
