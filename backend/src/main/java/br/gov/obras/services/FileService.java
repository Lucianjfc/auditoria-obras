package br.gov.obras.services;

import br.gov.obras.entities.Arquivo;
import br.gov.obras.dtos.ArquivoBinarioDTO;
import br.gov.obras.dtos.ArquivoDTO;
import br.gov.obras.exceptions.AppException;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

	ArquivoDTO upload(MultipartFile file) throws AppException;

	ArquivoBinarioDTO download(ArquivoDTO arquivoDTO) throws AppException;
	
	void remover(String arquivoRelativePath) throws AppException;

	void copiarParaLocalDefinitivo(Long id, ArquivoDTO arquivoDTO, Arquivo arquivo) throws AppException;
	
}
