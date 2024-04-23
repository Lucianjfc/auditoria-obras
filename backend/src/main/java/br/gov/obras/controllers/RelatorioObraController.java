package br.gov.obras.controllers;

import br.gov.obras.dtos.ArquivoBinarioDTO;
import br.gov.obras.dtos.ArquivoDTO;
import br.gov.obras.dtos.requests.ArquivoRelatorioObraDTO;
import br.gov.obras.dtos.requests.RelatorioObraDTO;
import br.gov.obras.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.obras.entities.RelatorioObra;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.services.RelatorioObraService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

@Tag(name = "Relatorio Obra")
@RestController
@RequestMapping("/relatorio-obra")
public class RelatorioObraController extends AbstractController<RelatorioObra, RelatorioObraFiltroRequest, RelatorioObraService> {

    @Autowired
    private RelatorioObraService service;

    @Override
    protected RelatorioObraService getService() {
        return service;
    }

    @PostMapping("/upload")
    public ResponseEntity<ArquivoDTO> upload(@RequestParam("file") MultipartFile file) throws AppException {
        ArquivoDTO response = service.upload(file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@Valid ArquivoDTO arquivoDTO) throws AppException {
        ArquivoBinarioDTO arquivoBinarioDTO = service.download(arquivoDTO);
        byte[] result = arquivoBinarioDTO.getBinario();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", arquivoBinarioDTO.getNomeOriginal()));

        ByteArrayResource resource = new ByteArrayResource(result);

        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(arquivoBinarioDTO.getTipoArquivo())).body(resource);
    }

    @DeleteMapping("/{idRelatorioObra:[0-9]+}/arquivos/{idArquivo:[0-9]+}")
    public ResponseEntity<Void> removerArquivo(@PathVariable("idRelatorioObra") Long idRelatorioObra, @PathVariable("idArquivo") Long idArquivo) throws AppException {
        service.removerArquivo(idRelatorioObra, idArquivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{idRelatorioObra:[0-9]+}/arquivos")
    public ResponseEntity<List<ArquivoRelatorioObraDTO>> recuperarArquivos(@PathVariable("idRelatorioObra") Long idRelatorioObra) throws AppException {
        List<ArquivoRelatorioObraDTO> resultado = service.recuperarArquivos(idRelatorioObra);
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{idRelatorioObra:[0-9]+}/arquivos/{idArquivo:[0-9]+}")
    public ResponseEntity<ArquivoRelatorioObraDTO> atualizarArquivo(@PathVariable("idRelatorioObra") Long idRelatorioObra, @PathVariable("idArquivo") Long idArquivo, @RequestBody @Valid ArquivoRelatorioObraDTO arquivoRelatorioObraDTO) throws AppException {
        arquivoRelatorioObraDTO.setIdArquivo(idArquivo);
        ArquivoRelatorioObraDTO resultado = service.atualizarArquivo(idRelatorioObra, arquivoRelatorioObraDTO, true);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/importar-relatorio")
    public ResponseEntity<Void> validacaoArquivos(@Valid @RequestBody RelatorioObraDTO dto) throws AppException {
        service.importarRelatorio(dto.getRelatorioObra(), dto.getArquivos());
        return ResponseEntity.ok().build();
    }
}
