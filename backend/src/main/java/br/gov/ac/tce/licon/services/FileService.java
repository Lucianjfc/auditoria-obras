package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.entities.Arquivo;
import org.springframework.web.multipart.MultipartFile;

import br.gov.ac.tce.licon.dtos.ArquivoBinarioDTO;
import br.gov.ac.tce.licon.dtos.ArquivoDTO;
import br.gov.ac.tce.licon.exceptions.AppException;

public interface FileService {

	ArquivoDTO upload(MultipartFile file) throws AppException;

	ArquivoBinarioDTO download(ArquivoDTO arquivoDTO) throws AppException;
	
	void remover(String arquivoRelativePath) throws AppException;

	void copiarParaLocalDefinitivo(Long id, ArquivoDTO arquivoDTO, Arquivo arquivo) throws AppException;
	
}
