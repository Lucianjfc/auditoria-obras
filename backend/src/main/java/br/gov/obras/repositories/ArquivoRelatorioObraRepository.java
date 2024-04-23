package br.gov.obras.repositories;

import br.gov.obras.entities.ArquivoRelatorioObra;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArquivoRelatorioObraRepository extends ArquivoRepository<ArquivoRelatorioObra> {

    @Query("SELECT a FROM ArquivoRelatorioObra a WHERE a.relatorioObra.id = ?1")
    List<ArquivoRelatorioObra> buscarPor(Long idRelatorioObra);

}
