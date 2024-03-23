package br.gov.ac.tce.licon.controllers;

import br.gov.ac.tce.licon.dtos.requests.CatalogoObraRequest;
import br.gov.ac.tce.licon.dtos.responses.BuscaResponse;
import br.gov.ac.tce.licon.dtos.responses.FailureResponse;
import br.gov.ac.tce.licon.entities.elastic.SicroElastic;
import br.gov.ac.tce.licon.entities.elastic.SinapiElastic;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.services.CatalogoObraElasticService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Catalogo Obra")
@RestController
@RequestMapping("/catalogo-obra")
public class CatalogoObraController {

    @Autowired
    private CatalogoObraElasticService service;

    @Value("${spring.profiles.active}")
    private String profile;

    protected CatalogoObraElasticService getService() {
        return service;
    }

    @PostMapping(value = "/elastic-search-sinapi")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Response"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))),
            @ApiResponse(responseCode = "404", description = "Not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))),
            @ApiResponse(description = "Unexpected error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), })
    public ResponseEntity<BuscaResponse<?>> buscarElasticSearchSinapi(@RequestBody CatalogoObraRequest filtro) throws AppException {
            BuscaResponse<SinapiElastic> response = service.searchSinapi(filtro);
            return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/elastic-search-sicro")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Response"),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))),
            @ApiResponse(responseCode = "404", description = "Not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))),
            @ApiResponse(description = "Unexpected error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), })
    public ResponseEntity<BuscaResponse<?>> buscarElasticSearchSicro(@RequestBody CatalogoObraRequest filtro) throws AppException {
        BuscaResponse<SicroElastic> response = service.searchSicro(filtro);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/elastic-search-sicro/{codigo}")
    @Operation(description = "Obtem uma entidade a partir de seu CODIGO")
    @ApiResponses(value = {  //
            @ApiResponse(responseCode = "200", description = "Response"), //
            @ApiResponse(responseCode = "400", description = "Bad request", //
                    content = @Content(mediaType = "application/json", //
                            schema = @Schema(implementation = FailureResponse.class))), //
            @ApiResponse(responseCode = "404", description = "Not found", //
                    content = @Content(mediaType = "application/json", //
                            schema = @Schema(implementation = FailureResponse.class))), //
            @ApiResponse(responseCode = "default", description = "Unexpected error", //
                    content = @Content(mediaType = "application/json", //
                            schema = @Schema(implementation = FailureResponse.class))), //
    })
    public ResponseEntity<?> getByCodigoSicro(@PathVariable("codigo") String codigo) throws AppException {
        SicroElastic response = service.searchByCodigoSicro(codigo);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/elastic-search-sinapi/{codigo}")
    @Operation(description = "Obtem uma entidade a partir de seu CODIGO")
    @ApiResponses(value = {  //
            @ApiResponse(responseCode = "200", description = "Response"), //
            @ApiResponse(responseCode = "400", description = "Bad request", //
                    content = @Content(mediaType = "application/json", //
                            schema = @Schema(implementation = FailureResponse.class))), //
            @ApiResponse(responseCode = "404", description = "Not found", //
                    content = @Content(mediaType = "application/json", //
                            schema = @Schema(implementation = FailureResponse.class))), //
            @ApiResponse(responseCode = "default", description = "Unexpected error", //
                    content = @Content(mediaType = "application/json", //
                            schema = @Schema(implementation = FailureResponse.class))), //
    })
    public ResponseEntity<?> getByCodigoSinapi(@PathVariable("codigo") String codigo) throws AppException {
        SinapiElastic response = service.searchByCodigoSinapi(codigo);
        return ResponseEntity.ok(response);
    }

}
