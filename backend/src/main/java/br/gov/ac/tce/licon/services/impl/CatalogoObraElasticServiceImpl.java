package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.configuration.PaginationConfig;
import br.gov.ac.tce.licon.dtos.requests.CatalogoObraRequest;
import br.gov.ac.tce.licon.dtos.requests.Page;
import br.gov.ac.tce.licon.dtos.responses.BuscaResponse;
import br.gov.ac.tce.licon.dtos.responses.ReferenciaDTO;
import br.gov.ac.tce.licon.dtos.responses.SicroResponse;
import br.gov.ac.tce.licon.dtos.responses.SinapiResponse;
import br.gov.ac.tce.licon.entities.ItemObra;
import br.gov.ac.tce.licon.entities.elastic.CaracteristicaSicroElastic;
import br.gov.ac.tce.licon.entities.elastic.CaracteristicaSinapiElastic;
import br.gov.ac.tce.licon.entities.elastic.SicroElastic;
import br.gov.ac.tce.licon.entities.elastic.SinapiElastic;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.services.CatalogoObraElasticService;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.*;
import org.elasticsearch.index.search.MatchQueryParser;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CatalogoObraElasticServiceImpl implements CatalogoObraElasticService {
    private static final String INDEX_SINAPI = "sinapi_index";
    private static final String INDEX_SICRO = "sicro_index";

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    @Autowired
    protected PaginationConfig paginationConfig;

    public BuscaResponse<SinapiElastic> searchSinapi(CatalogoObraRequest filtro) {
        BuscaResponse<SinapiElastic> response = new BuscaResponse<>();
        String url = "http://localhost:5001/search-sinapi";
        RestTemplate restTemplate = new RestTemplate();
        SinapiResponse items = restTemplate.postForObject(url, filtro, SinapiResponse.class);
        response.setItems(items.getResponse());
        response.setTotal(items.getResponse().size());
        return response;
    }

    public BuscaResponse<SicroElastic> searchSicro(CatalogoObraRequest filtro) {
        BuscaResponse<SicroElastic> response = new BuscaResponse<>();
        String url = "http://localhost:5001/search-sicro";
        RestTemplate restTemplate = new RestTemplate();
        SicroResponse items = restTemplate.postForObject(url, filtro, SicroResponse.class);
        response.setItems(items.getResponse());
        response.setTotal(items.getResponse().size());
        return response;
    }

    @Override
    public SicroElastic searchByCodigoSicro(String codigo) throws AppException {
        TermQueryBuilder termQuery = QueryBuilders.termQuery("CODIGO", codigo);
        Query searchQuery = new NativeSearchQueryBuilder()
                .withQuery(termQuery)
                .build();

        SearchHit<SicroElastic> result = elasticsearchOperations.searchOne(searchQuery, SicroElastic.class, IndexCoordinates.of(INDEX_SICRO));

        if (result != null) {
            return result.getContent();
        } else {
            return null;
        }
    }

    @Override
    public SinapiElastic searchByCodigoSinapi(String codigo) throws AppException {
        TermQueryBuilder termQuery = QueryBuilders.termQuery("CODIGO", codigo);
        Query searchQuery = new NativeSearchQueryBuilder()
                .withQuery(termQuery)
                .build();

        SearchHit<SinapiElastic> result = elasticsearchOperations.searchOne(searchQuery, SinapiElastic.class, IndexCoordinates.of(INDEX_SINAPI));

        if (result != null) {
            return result.getContent();
        } else {
            return null;
        }
    }

    @Override
    public SicroElastic searchByDescricaoSicro(String descricao) throws AppException {
        CatalogoObraRequest catalogoObraRequest = new CatalogoObraRequest();
        catalogoObraRequest.setSearch(descricao);
        Page page = new Page();
        page.setIndex(1);
        page.setSize(1);
        catalogoObraRequest.setPage(page);
        BuscaResponse<SicroElastic> response = this.searchSicro(catalogoObraRequest);
        if (response != null && response.getItems().size() > 0) {
            return response.getItems().get(0);
        } else {
            return null;
        }
    }

    @Override
    public SinapiElastic searchByDescricaoSinapi(String descricao) throws AppException {
        CatalogoObraRequest catalogoObraRequest = new CatalogoObraRequest();
        catalogoObraRequest.setSearch(descricao);
        Page page = new Page();
        page.setIndex(1);
        page.setSize(1);
        catalogoObraRequest.setPage(page);
        BuscaResponse<SinapiElastic> response = this.searchSinapi(catalogoObraRequest);
        if (response != null && response.getItems().size() > 0) {
            return response.getItems().get(0);
        } else {
            return null;
        }
    }

    @Override
    public List<ItemObra> getReferenciasByItens(List<ItemObra> itensObra) {
        itensObra.forEach((itemObra -> {
            if (itemObra.getFonte().equals("sinapi")) {
                SinapiElastic referenciaElastic = this.searchByCodigoSinapi(itemObra.getCodigo());
                ReferenciaDTO referenciaDTO = new ReferenciaDTO(null, referenciaElastic);
                itemObra.setReferencia(referenciaDTO);
            } else {
                SicroElastic referenciaElastic = this.searchByCodigoSicro(itemObra.getCodigo());
                ReferenciaDTO referenciaDTO = new ReferenciaDTO(referenciaElastic, null);
                itemObra.setReferencia(referenciaDTO);
            }
        }));
        return itensObra;
    }

    @Override
    public ItemObra findItemObra(ItemObra itemObra) {
        if (itemObra.getCodigo() != null && !itemObra.getCodigo().isEmpty() && !itemObra.getCodigo().equals("-")) {
            SinapiElastic sinapiElastic = this.searchByCodigoSinapi(itemObra.getCodigo());
            SicroElastic sicroElastic = this.searchByCodigoSicro(itemObra.getCodigo());

            if (sicroElastic != null) {
                itemObra.setFonte("sicro");
                itemObra.setScore(sicroElastic.getScore());
                List<CaracteristicaSicroElastic> caracteristicas = sicroElastic.getCaracteristicasDesonerado();
                itemObra.setMesColeta(caracteristicas.get(caracteristicas.size() - 1).getMesColeta());
            } else if (sinapiElastic != null) {
                itemObra.setFonte("sinapi");
                itemObra.setScore(sinapiElastic.getScore());
                List<CaracteristicaSinapiElastic> caracteristicas = sinapiElastic.getCaracteristicasDesonerado();
                itemObra.setMesColeta(caracteristicas.get(caracteristicas.size() - 1).getMesColeta());
            }
        } else if (itemObra.getDescricao() != null && !itemObra.getDescricao().isEmpty()) {
            SinapiElastic sinapiElastic = this.searchByDescricaoSinapi(itemObra.getDescricao());
            SicroElastic sicroElastic = this.searchByDescricaoSicro(itemObra.getDescricao());

            if (sicroElastic != null && sinapiElastic != null && sicroElastic.getScore().compareTo(sinapiElastic.getScore()) > 0) {
                itemObra.setFonte("sicro");
                itemObra.setScore(sicroElastic.getScore());
                List<CaracteristicaSicroElastic> caracteristicas = sicroElastic.getCaracteristicasDesonerado();
                itemObra.setMesColeta(caracteristicas.get(caracteristicas.size() - 1).getMesColeta());
            } else if (sicroElastic != null && sinapiElastic != null && sinapiElastic.getScore().compareTo(sicroElastic.getScore()) > 0) {
                itemObra.setFonte("sinapi");
                itemObra.setScore(sinapiElastic.getScore());
                List<CaracteristicaSinapiElastic> caracteristicas = sinapiElastic.getCaracteristicasDesonerado();
                itemObra.setMesColeta(caracteristicas.get(caracteristicas.size() - 1).getMesColeta());
            }
        }
        return itemObra;
    }

    private void addTermQuery(BoolQueryBuilder boolQuery, String field, String value) {
        if (value != null && !value.isEmpty()) {
            boolQuery.filter(QueryBuilders.termQuery(field, value));
        }
    }

}
