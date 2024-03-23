package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.entities.enums.TipoEntidade;

import java.nio.file.Path;

public interface DirectoryLocatorService {

	Path getFullPathDestinoDefinitivo();

	Path getFullPathDestinoTemporario();
	
	Path getFullPathDestinoTemporario(String nomeDestino);

	Path getFullPathEntidade(TipoEntidade entidade);

}
