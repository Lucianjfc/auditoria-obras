package br.gov.ac.tce.licon.dtos.mapper;

import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraDTO;
import br.gov.ac.tce.licon.entities.ArquivoRelatorioObra;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

@Component
public class ArquivoRelatorioObraToDtoMapper implements EntityToDtoMapper<ArquivoRelatorioObra, ArquivoRelatorioObraDTO> {

	@Inject
	private ArquivoMappedSuperclassToDtoMapper arquivoMappedSuperclassToDtoMapper;
	
	@Override
	public ArquivoRelatorioObraDTO map(ArquivoRelatorioObra source) {
		ArquivoRelatorioObraDTO target = new ArquivoRelatorioObraDTO();
		arquivoMappedSuperclassToDtoMapper.map(source, target);
		target.setTipo(source.getTipo());
		return target;
	}

}
