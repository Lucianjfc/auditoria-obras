package br.gov.ac.tce.licon.dtos;

import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@Data
@SuperBuilder
public class ArquivoBinarioDTO {

	@NotNull
	private byte[] binario;
	
	@NotNull
	private String nomeOriginal;
	
	@NotNull
	private String tipoArquivo;
	
}
