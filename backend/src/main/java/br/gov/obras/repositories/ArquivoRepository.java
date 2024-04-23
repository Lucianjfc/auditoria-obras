package br.gov.obras.repositories;

import br.gov.obras.entities.Arquivo;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArquivoRepository<E extends Arquivo> extends IRepository<E> {

    @Query(value = "SELECT NULL", nativeQuery = true)
    List<E> buscarPor(Long idEntidade);
}
