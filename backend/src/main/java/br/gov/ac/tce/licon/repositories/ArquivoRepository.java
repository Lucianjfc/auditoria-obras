package br.gov.ac.tce.licon.repositories;

import br.gov.ac.tce.licon.entities.Arquivo;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArquivoRepository<E extends Arquivo> extends IRepository<E> {

    @Query(value = "SELECT NULL", nativeQuery = true)
    List<E> buscarPor(Long idEntidade);
}
