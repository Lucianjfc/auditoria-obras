package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.entities.Arquivo;
import br.gov.ac.tce.licon.entities.enums.TipoEntidade;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.services.ArquivoRelatorioObraFileService;
import br.gov.ac.tce.licon.services.ArquivoRelatorioObraService;
import com.j256.simplemagic.ContentType;
import org.springframework.stereotype.Service;
import javax.inject.Inject;

@Service
public class ArquivoRelatorioObraFileServiceImpl extends AbstractFileServiceImpl implements ArquivoRelatorioObraFileService {

    @Inject
    private ArquivoRelatorioObraService arquivoRelatorioObraService;

    @Override
    protected Arquivo lookupArquivoParaDownload(Long idArquivo) throws AppException {
        return arquivoRelatorioObraService.getById(idArquivo);
    }

    @Override
    protected TipoEntidade getTipoEntidade() {
        return TipoEntidade.RELATORIO_OBRA;
    }

    @Override
    protected ContentType[] tiposValidos() {
        return new ContentType[]{
                ContentType.MICROSOFT_EXCEL,
                ContentType.MICROSOFT_EXCEL_XML,
                ContentType.ZIP,
                ContentType.OTHER
        };
    }

}
