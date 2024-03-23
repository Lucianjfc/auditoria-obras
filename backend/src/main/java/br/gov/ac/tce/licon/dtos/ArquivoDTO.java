package br.gov.ac.tce.licon.dtos;

import java.util.UUID;

import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@Data
@SuperBuilder
public class ArquivoDTO {

	/**
	 * Identificador usado para buscar o arquivo. Formato:
	 * <ul>
	 * <li> "123" (Long): arquivo definitivo;
	 * <li> "89776ef0-396f-46db-9188-bf7f3d277057" (UUID): arquivo temporário.
	 * </ul>
	 */
	@NotNull
	private String lookupId; 
	
	@NotNull
	private String nomeOriginal;
	
	@NotNull
	private String tipoArquivo;

	public boolean ehArquivoDefinitivoValido() {
		try {
			Long.parseLong(lookupId);
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}
	
	public boolean ehArquivoTemporarioValido() {
		try {
			UUID.fromString(lookupId);
		} catch (IllegalArgumentException e) {
			return false;
		}
		return true;
	}

}
