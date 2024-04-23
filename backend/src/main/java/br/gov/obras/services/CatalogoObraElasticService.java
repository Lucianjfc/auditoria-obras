package br.gov.obras.services;

import br.gov.obras.dtos.requests.CatalogoObraRequest;
import br.gov.obras.dtos.responses.BuscaResponse;
import br.gov.obras.entities.ItemObra;
import br.gov.obras.entities.elastic.SicroElastic;
import br.gov.obras.entities.elastic.SinapiElastic;
import br.gov.obras.exceptions.AppException;

import java.util.List;

public interface CatalogoObraElasticService {

    BuscaResponse<SinapiElastic> searchSinapi(CatalogoObraRequest filtro) throws AppException;

    BuscaResponse<SicroElastic> searchSicro(CatalogoObraRequest filtro) throws AppException;

    SicroElastic searchByCodigoSicro(String codigo) throws AppException;

    SinapiElastic searchByCodigoSinapi(String codigo) throws AppException;

    List<ItemObra> getReferenciasByItens(List<ItemObra> itensObra);

    ItemObra findItemObra(ItemObra itemObra);

    SicroElastic searchByDescricaoSicro(String descricao) throws AppException;

    SinapiElastic searchByDescricaoSinapi(String descricao) throws AppException;

}
