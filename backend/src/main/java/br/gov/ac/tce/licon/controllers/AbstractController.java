package br.gov.ac.tce.licon.controllers;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.dtos.requests.advancedSearch.AdvancedSearchRequest;
import br.gov.ac.tce.licon.dtos.responses.BuscaResponse;
import br.gov.ac.tce.licon.dtos.responses.FailureResponse;
import br.gov.ac.tce.licon.entities.AbstractIdentificavel;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.services.IService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = {"${allowed.origins}"})
@Validated
public abstract class AbstractController<E extends AbstractIdentificavel, //
        F extends AbstractFiltroRequest, //
        S extends IService<E, F>> { //

    protected abstract S getService();

    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractController.class);

    @PostMapping
    @Operation(description = "Cria uma nova entidade")
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
    public ResponseEntity<E> criar(@Valid @RequestBody E entity) throws AppException {
        entity.setId(null); // Medida de segurança para garantir que estamos tentando criar uma nova entidade
        E e = getService().save(entity);
        return ResponseEntity.ok(e);
    }

    @GetMapping(value = "/{id}")
    @Operation(description = "Obtem uma entidade a partir de seu ID")
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
    public ResponseEntity<E> getById(@PathVariable("id") Long id) throws AppException {
        E entity = getService().getById(id);
        return ResponseEntity.ok(entity);
    }

    @GetMapping(value = "/all")
    @Operation(description = "Obtem todas as entidades")
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
    public ResponseEntity<List<E>> getAll() throws AppException {
        return ResponseEntity.ok(getService().getAll());
    }

    @DeleteMapping(value = "/{id}")
    @Operation(description = "Remover uma entidade")
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
    public ResponseEntity<E> remover(@PathVariable("id") Long id) throws AppException {
        getService().remover(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value = "/{id}")
    @Operation(description = "Atualizar uma entidade")
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
    public ResponseEntity<E> atualizar(@PathVariable("id") Long id, @Valid @RequestBody E entity) throws AppException {
        entity.setId(id);

        E e = getService().save(entity);
        return ResponseEntity.ok(e);
    }

    @GetMapping
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Response"), @ApiResponse(responseCode = "400", description = "Bad request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), @ApiResponse(responseCode = "404", description = "Not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), @ApiResponse(responseCode = "default", description = "Unexpected error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), })
    public ResponseEntity<BuscaResponse<E>> buscar(@Valid F filtro) throws AppException {
        BuscaResponse<E> result = getService().buscar(filtro);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/advanced-search")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Response"), @ApiResponse(responseCode = "400", description = "Bad request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), @ApiResponse(responseCode = "404", description = "Not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), @ApiResponse(responseCode = "default", description = "Unexpected error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), })
    public ResponseEntity<BuscaResponse<E>> buscarAdvanced(@RequestBody AdvancedSearchRequest filtro) throws AppException {
        BuscaResponse<E> result = getService().buscarAdvanced(filtro);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/advanced-search-all")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Response"), @ApiResponse(responseCode = "400", description = "Bad request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), @ApiResponse(responseCode = "404", description = "Not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), @ApiResponse(responseCode = "default", description = "Unexpected error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = FailureResponse.class))), })
    public ResponseEntity<List<E>> buscarAllAdvanced(@RequestBody AdvancedSearchRequest filtro) throws AppException {
        return ResponseEntity.ok(getService().buscarAllAdvanced(filtro));
    }

    @GetMapping(value = "/allSort")
    @Operation(description = "Obtem todas as entidades com ordenação")
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
    public ResponseEntity<List<E>> getAllSort(F filtro) throws AppException {
        return ResponseEntity.ok(getService().getAllSort(filtro));
    }

}
