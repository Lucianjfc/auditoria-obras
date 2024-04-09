package br.gov.ac.tce.licon.services.impl;

import java.nio.file.Path;
import java.nio.file.Paths;

import br.gov.ac.tce.licon.entities.enums.TipoEntidade;
import br.gov.ac.tce.licon.services.DirectoryLocatorService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DirectoryLocatorServiceImpl implements DirectoryLocatorService {

    @Value("${app.files.repository-full-path}")
    private String repositoryFullPath;

    @Value("${app.files.temp-folder-path}")
    private String tempFolderPath;

    @Value("${app.files.definitive-folder-path}")
    private String definitiveFolderPath;
    @Value("${app.files.relatorio-obra-folder-path}")
    private String relatorioObraFolderPath;

    public Path getFullPathDestinoDefinitivo() {
        return Paths.get(repositoryFullPath, definitiveFolderPath);
    }

    public Path getFullPathDestinoTemporario() {
        return Paths.get(repositoryFullPath, tempFolderPath);
    }

    public Path getFullPathDestinoTemporario(String nomeDestino) {
        return getFullPathDestinoTemporario().resolve(nomeDestino);
    }

    public Path getFullPathEntidade(TipoEntidade entidade) {
        switch (entidade) {
            case RELATORIO_OBRA:
                return getFullPathDestinoDefinitivo().resolve(Paths.get(relatorioObraFolderPath));
            default:
                return getFullPathDestinoDefinitivo();
        }
    }

}
