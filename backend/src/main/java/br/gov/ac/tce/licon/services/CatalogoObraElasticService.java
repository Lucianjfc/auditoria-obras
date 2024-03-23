package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.CatalogoObraRequest;
import br.gov.ac.tce.licon.dtos.responses.BuscaResponse;
import br.gov.ac.tce.licon.entities.ItemObra;
import br.gov.ac.tce.licon.entities.elastic.SicroElastic;
import br.gov.ac.tce.licon.entities.elastic.SinapiElastic;
import br.gov.ac.tce.licon.exceptions.AppException;

import java.util.List;

public interface CatalogoObraElasticService {

    BuscaResponse<SinapiElastic> searchSinapi(CatalogoObraRequest filtro) throws AppException;

    BuscaResponse<SicroElastic> searchSicro(CatalogoObraRequest filtro) throws AppException;

    SicroElastic searchByCodigoSicro(String codigo) throws AppException;

    SinapiElastic searchByCodigoSinapi(String codigo) throws AppException;

    List<ItemObra> getReferenciasByItens(List<ItemObra> itensObra);

    ItemObra findItemObra(ItemObra itemObra);

    public SicroElastic searchByDescricaoSicro(String descricao) throws AppException;

    public SinapiElastic searchByDescricaoSinapi(String descricao) throws AppException;

}
