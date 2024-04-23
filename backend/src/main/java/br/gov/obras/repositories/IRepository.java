package br.gov.obras.repositories;

import br.gov.obras.entities.AbstractIdentificavel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IRepository<E extends AbstractIdentificavel> extends JpaRepository<E, Long>, JpaSpecificationExecutor<E> {

}
