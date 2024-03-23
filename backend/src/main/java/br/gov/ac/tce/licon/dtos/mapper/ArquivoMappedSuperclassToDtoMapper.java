package br.gov.ac.tce.licon.dtos.mapper;

import org.springframework.stereotype.Component;

import br.gov.ac.tce.licon.dtos.ArquivoDTO;
import br.gov.ac.tce.licon.dtos.requests.ArquivoMappedSuperclassDTO;
import br.gov.ac.tce.licon.entities.Arquivo;

@Component
public class ArquivoMappedSuperclassToDtoMapper implements EntityToDtoMapper<Arquivo, ArquivoMappedSuperclassDTO> {

	@Override
	public void map(Arquivo source, ArquivoMappedSuperclassDTO target) {
		target.setIdArquivo(source.getId());
		target.setDescricao(source.getDescricao());
		target.setDataEnvio(source.getDataEnvio());

		ArquivoDTO arquivo = new ArquivoDTO();
		arquivo.setLookupId("" + source.getId());
		arquivo.setNomeOriginal(source.getNome());
		arquivo.setTipoArquivo(source.getTipoArquivo());
		target.setArquivo(arquivo);
	}

}
