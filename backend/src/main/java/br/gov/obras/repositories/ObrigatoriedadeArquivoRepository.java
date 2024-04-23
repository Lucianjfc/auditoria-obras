package br.gov.obras.repositories;

import br.gov.obras.entities.ObrigatoriedadeArquivo;
import br.gov.obras.entities.enums.Objeto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ObrigatoriedadeArquivoRepository extends IRepository<ObrigatoriedadeArquivo> {

    List<ObrigatoriedadeArquivo> findAllByObjetoAndObrigatorioAntigoTrue(Objeto objeto);

    List<ObrigatoriedadeArquivo> findAllByObjetoAndObrigatorioTrue(Objeto objeto);

    @Query(value = "SELECT oa.OBJETO, CA.OBRIGATORIEDADE AS OBRIGATORIO, oa.ARQUIVO, oa.ARQUIVO_ENUM, oa.EXIBIR_PORTAL, OA.EXIBIR_PRIMEIRA_FASE, OA.OBRIGATORIO_ANTIGO " +
            "FROM DBO.OBRIGATORIEDADE_ARQUIVO OA \n" +
            "JOIN DBO.CONFIGURACAO_ARQUIVO CA ON OA.ID_OBRIGATORIEDADE_ARQUIVO = CA.ID_OBRIGATORIEDADE_ARQUIVO " +
            "JOIN DBO.FILTRO_ARQUIVO FA ON CA.ID_CONFIGURACAO_ARQUIVO = FA.ID_CONFIGURACAO_ARQUIVO " +
            "WHERE CA.TIPO_PROCESSO = :tipoProcesso " +
            "AND FA.FILTRO IN :filtros " +
            "AND NOT EXISTS (" +
            "SELECT 1 " +
            "FROM DBO.FILTRO_ARQUIVO FA2 " +
            "WHERE FA2.ID_CONFIGURACAO_ARQUIVO = FA.ID_CONFIGURACAO_ARQUIVO " +
            "AND FA2.FILTRO NOT IN :filtros) " +
            "GROUP BY oa.OBJETO, ca.OBRIGATORIEDADE, oa.ARQUIVO, oa.ARQUIVO_ENUM, oa.EXIBIR_PORTAL, OA.EXIBIR_PRIMEIRA_FASE, OA.OBRIGATORIO_ANTIGO " +
            "HAVING COUNT(DISTINCT FA.FILTRO) = :quantidadeFiltros " +
            "ORDER BY CA.OBRIGATORIEDADE DESC", nativeQuery = true)
    List<Object[]> getArquivosObrigatorios(
            @Param("tipoProcesso") String tipoProcesso,
            @Param("filtros") List<String> filtros,
            @Param("quantidadeFiltros") Long quantidadeFiltros);
}
