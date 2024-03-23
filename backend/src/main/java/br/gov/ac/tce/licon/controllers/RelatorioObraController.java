package br.gov.ac.tce.licon.controllers;

import br.gov.ac.tce.licon.dtos.ArquivoBinarioDTO;
import br.gov.ac.tce.licon.dtos.ArquivoDTO;
import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraDTO;
import br.gov.ac.tce.licon.dtos.requests.RelatorioObraDTO;
import br.gov.ac.tce.licon.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.entities.RelatorioObra;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.services.RelatorioObraService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @Value("${spring.profiles.active}")
    private String profile;

    @Override
    protected RelatorioObraService getService() {
        return service;
    }

    @PreAuthorize("hasAnyAuthority(@userPermissionService.getWritePermission(#this.this.class.name))")
    @PostMapping("/upload")
    public ResponseEntity<ArquivoDTO> upload(@RequestParam("file") MultipartFile file) throws AppException {
        ArquivoDTO response = service.upload(file);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyAuthority(@userPermissionService.getReadPermission(#this.this.class.name))")
    @GetMapping("/download")
    public ResponseEntity<Resource> download(@Valid ArquivoDTO arquivoDTO) throws AppException {
        ArquivoBinarioDTO arquivoBinarioDTO = service.download(arquivoDTO);
        byte[] result = arquivoBinarioDTO.getBinario();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", arquivoBinarioDTO.getNomeOriginal()));

        ByteArrayResource resource = new ByteArrayResource(result);

        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(arquivoBinarioDTO.getTipoArquivo())).body(resource);
    }

    @PreAuthorize("hasAnyAuthority(@userPermissionService.getWritePermission(#this.this.class.name))")
    @DeleteMapping("/{idRelatorioObra:[0-9]+}/arquivos/{idArquivo:[0-9]+}")
    public ResponseEntity<Void> removerArquivo(@PathVariable("idRelatorioObra") Long idRelatorioObra, @PathVariable("idArquivo") Long idArquivo) throws AppException {
        service.removerArquivo(idRelatorioObra, idArquivo);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyAuthority(@userPermissionService.getReadPermission(#this.this.class.name))")
    @GetMapping("/{idRelatorioObra:[0-9]+}/arquivos")
    public ResponseEntity<List<ArquivoRelatorioObraDTO>> recuperarArquivos(@PathVariable("idRelatorioObra") Long idRelatorioObra) throws AppException {
        List<ArquivoRelatorioObraDTO> resultado = service.recuperarArquivos(idRelatorioObra);
        return ResponseEntity.ok(resultado);
    }

    @PreAuthorize("hasAnyAuthority(@userPermissionService.getWritePermission(#this.this.class.name))")
    @PutMapping("/{idRelatorioObra:[0-9]+}/arquivos/{idArquivo:[0-9]+}")
    public ResponseEntity<ArquivoRelatorioObraDTO> atualizarArquivo(@PathVariable("idRelatorioObra") Long idRelatorioObra, @PathVariable("idArquivo") Long idArquivo, @RequestBody @Valid ArquivoRelatorioObraDTO arquivoRelatorioObraDTO) throws AppException {
        arquivoRelatorioObraDTO.setIdArquivo(idArquivo);
        ArquivoRelatorioObraDTO resultado = service.atualizarArquivo(idRelatorioObra, arquivoRelatorioObraDTO, true);
        return ResponseEntity.ok(resultado);
    }

    @PreAuthorize("hasAnyAuthority(@userPermissionService.getReadPermission(#this.this.class.name))")
    @PostMapping("/importar-relatorio")
    public ResponseEntity<Void> validacaoArquivos(@Valid @RequestBody RelatorioObraDTO dto) throws AppException {
        service.importarRelatorio(dto.getRelatorioObra(), dto.getArquivos());
        return ResponseEntity.ok().build();
    }
}
