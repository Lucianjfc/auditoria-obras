package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.entities.AbstractIdentificavel;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.repositories.IRepository;
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
