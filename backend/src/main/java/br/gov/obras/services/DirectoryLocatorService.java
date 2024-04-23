package br.gov.obras.services;

import br.gov.obras.entities.enums.TipoEntidade;

import java.nio.file.Path;

public interface DirectoryLocatorService {

	Path getFullPathDestinoDefinitivo();

	Path getFullPathDestinoTemporario();
	
	Path getFullPathDestinoTemporario(String nomeDestino);

	Path getFullPathEntidade(TipoEntidade entidade);

}
