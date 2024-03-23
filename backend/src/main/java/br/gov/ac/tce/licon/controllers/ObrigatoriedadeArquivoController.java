package br.gov.ac.tce.licon.controllers;

import br.gov.ac.tce.licon.dtos.requests.ObrigatoriedadeArquivoFiltroRequest;
import br.gov.ac.tce.licon.dtos.requests.ObrigatoriedadeArquivosRequestDTO;
import br.gov.ac.tce.licon.entities.ObrigatoriedadeArquivo;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.services.ObrigatoriedadeArquivoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@Tag(name = "ObrigatoriedadeArquivo")
@RestController
@RequestMapping("/obrigatoriedade-arquivo")
public class ObrigatoriedadeArquivoController extends AbstractController<ObrigatoriedadeArquivo, ObrigatoriedadeArquivoFiltroRequest, ObrigatoriedadeArquivoService> {

	@Autowired
	private ObrigatoriedadeArquivoService service;
	
	@Override
	protected ObrigatoriedadeArquivoService getService() {
		return service;
	}

	@PostMapping("/arquivos-obrigatorios")
	public ResponseEntity<List<ObrigatoriedadeArquivo>> getArquivosObrigatorios(@Valid @RequestBody ObrigatoriedadeArquivosRequestDTO dto) throws AppException {
		List<ObrigatoriedadeArquivo> result = service.getArquivosObrigatorios(dto.getTipoProcesso(), dto.getFiltros());
		return ResponseEntity.ok(result);
	}
}
