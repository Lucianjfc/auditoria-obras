package br.gov.ac.tce.licon.repositories;

import br.gov.ac.tce.licon.entities.ArquivoRelatorioObra;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArquivoRelatorioObraRepository extends ArquivoRepository<ArquivoRelatorioObra> {

    @Query("SELECT a FROM ArquivoRelatorioObra a WHERE a.relatorioObra.id = ?1")
    List<ArquivoRelatorioObra> buscarPor(Long idRelatorioObra);

}
