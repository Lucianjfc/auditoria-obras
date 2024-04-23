package br.gov.obras.services.impl;

import br.gov.obras.configuration.PaginationConfig;
import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.dtos.requests.advancedSearch.AdvancedSearchRequest;
import br.gov.obras.dtos.responses.BuscaResponse;
import br.gov.obras.entities.AbstractIdentificavel;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.repositories.IRepository;
import br.gov.obras.services.IService;
import br.gov.obras.services.advancedSearch.AdvancedSpecification;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Optional;

@Getter(value = AccessLevel.PROTECTED)
public abstract class AbstractService<E extends AbstractIdentificavel, F extends AbstractFiltroRequest, R extends IRepository<E>> implements IService<E, F> {

    @Autowired
    private PaginationConfig paginationConfig;

    @Value("${app.name}")
    protected String app;

    private final Class<E> persistentClass;

    @SuppressWarnings("unchecked")
    protected AbstractService() {
        this.persistentClass = (Class<E>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    protected String getEntityName() {
        return persistentClass.getSimpleName();
    }

    public abstract R getRepository();

    protected PaginationConfig getPaginationConfig() {
        return this.paginationConfig;
    }

    public E getById(Long id) throws AppException {
        Optional<E> entidadeOpt = getRepository().findById(id);
        if (entidadeOpt.isPresent()) {
            return entidadeOpt.get();
        } else {
            throw new AppException(String.format("Entidade '%s' com ID '%d' não encontrada.", getEntityName(), id), HttpStatus.NOT_FOUND);
        }
    }

    public List<E> getAll() {
        return getRepository().findAll();
    }

    public void remover(Long id) throws AppException {
        Optional<E> entidadeOpt = getRepository().findById(id);
        if (entidadeOpt.isPresent()) {
            E entidade = entidadeOpt.get();
            validarRemover(entidade);
            getRepository().delete(entidade); // Remover a entidade em si e não pelo ID, de modo que o cascade do JPA entre em ação
        } else {
            throw new AppException(String.format("Entidade '%s' com ID '%d' não encontrada.", getEntityName(), id), HttpStatus.NOT_FOUND);
        }
    }

    protected void validarRemover(E entidade) throws AppException {

    }

    public E save(E entity) throws AppException {
        beforeSave(entity);
        resolverRelacionamentos(entity);
        checarSeJahExiste(entity);
        validar(entity);
        if (entity.getId() != null) {
            beforeUpdate(entity);
        }
        boolean isNew = entity.getId() == null;
        E e = getRepository().save(entity);
        afterSave(isNew, e);
        return entity;
    }

    protected void afterSave(boolean isNew, E entity) {
        // not implemented
    }

    protected void beforeSave(E entity) {
        // not implemented
    }

    protected void resolverRelacionamentos(E entity) throws AppException {
        // not implemented
    }

    public void checarSeJahExiste(E entity) throws AppException {
        Example<E> exemplo = obterExemploChecarSeJahExiste(entity);
        if (exemplo != null) {
            boolean existe = getRepository().exists(exemplo);
            if (existe) {
                List<E> list = getRepository().findAll(exemplo);
                if (!list.isEmpty()) {
                    list.forEach(e -> {
                        if (!e.getId().equals(entity.getId())) {
                            lancarErroEntidadeJahExistente(entity);
                        }
                    });
                } else {
                    lancarErroEntidadeJahExistente(entity);
                }
            }
        }
    }

    protected void validar(E entity) throws AppException {
        // not implemented
    }

    protected void beforeUpdate(E entity) {
        Optional<E> entityOpt = getRepository().findById(entity.getId());
        if (entityOpt.isPresent()) {
            E persistedEntity = entityOpt.get();
            validateCollectionsRemoval(entity, persistedEntity);
        }
    }

    protected void validateCollectionsRemoval(E entity, E persistedEntity) {
        // not implemented
    }

    protected void lancarErroEntidadeJahExistente(E entity) throws AppException {
        throw new AppException(String.format("Entidade '%s' já existe.", getEntityName()), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    protected Example<E> obterExemploChecarSeJahExiste(E entity) throws AppException {
        // Do nothing
        return null;
    }

    public BuscaResponse<E> buscar(F filtro) {
        Specification<E> spec = getSpecification(filtro);
        Page<E> page = getRepository().findAll(spec, paginationConfig.toPageRequest(filtro));
        BuscaResponse<E> response = new BuscaResponse<>();
        response.setTotal(page.getTotalElements());
        response.setItems(getItemsBuscar(page));
        return response;
    }

    public BuscaResponse<E> buscarAdvanced(AdvancedSearchRequest filtro) {
        resolverRelacionamentosAdvancedSearch(filtro);
        Specification<E> spec = getSpecification(filtro);
        Page<E> page = getRepository().findAll(spec, paginationConfig.toPageRequest(filtro));
        BuscaResponse<E> response = new BuscaResponse<>();
        response.setTotal(page.getTotalElements());
        response.setItems(getItemsBuscar(page));
        return response;
    }

    public List<E> buscarAllAdvanced(AdvancedSearchRequest filtro) {
        resolverRelacionamentosAdvancedSearch(filtro);
        Specification<E> spec = getSpecification(filtro);
        if (filtro.getSort() != null) {
            String sortBy = filtro.getSort().getBy();
            return getRepository().findAll(spec, Sort.by(Sort.Direction.fromString(filtro.getSort().getOrder().name()), sortBy));
        } else {
            return getRepository().findAll(spec);
        }
    }

    protected void setDefaultFilterParams(AdvancedSearchRequest filtro) {

    }

    protected void resolverRelacionamentosAdvancedSearch(AdvancedSearchRequest filtro) {
        // nao faz nada
    }

    protected List<E> getItemsBuscar(Page<E> page) {
        page.get().forEach((E e) -> {
            // tratamento específico para entidades retornadas
        });
        return page.getContent();
    }

    protected abstract Specification<E> getSpecification(F filtro);

    protected Specification<E> getSpecification(AdvancedSearchRequest filtro) {
        return new AdvancedSpecification<>(filtro);
    }

    public List<E> getAllSort(F filtro) {
        String sortBy = filtro.getSort().getBy();
        return getRepository().findAll(Sort.by(Sort.Direction.fromString(filtro.getSort().getOrder().name()), sortBy));
    }

    private boolean isUsuarioJurisdicionado() {
        String grupos = ThreadContext.get("groups");
        return grupos != null && grupos.contains("Jurisdicionado");
    }

}
