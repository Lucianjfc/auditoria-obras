package br.gov.ac.tce.licon.services;

import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.dtos.requests.ArquivoUploadDTO;
import br.gov.ac.tce.licon.entities.AbstractIdentificavel;
import br.gov.ac.tce.licon.entities.ArquivoTipo;
import br.gov.ac.tce.licon.entities.ObrigatoriedadeArquivo;
import br.gov.ac.tce.licon.entities.enums.TipoArquivo;
import br.gov.ac.tce.licon.exceptions.AppException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface AbstractUploadTipoService<E extends AbstractIdentificavel, F extends AbstractFiltroRequest, AU extends ArquivoUploadDTO<EA>, EA extends TipoArquivo, AT extends ArquivoTipo<EA>> extends AbstractUploadService<E, F, AU, AT> {

    AU atualizarArquivo(Long idEntity, AU arquivoUploadDTO, boolean validarArquivos);

    void verificarArquivosObrigatorios(List<EA> tiposArquivosEnviados, List<ObrigatoriedadeArquivo> obrigatoriedades) throws AppException;

    List<AU> recuperarArquivos(Long idEntity);

    void validarArquivos(List<AU> arquivos);

    void verificarDescricaoTipoOutros(List<AU> arquivos);
}
