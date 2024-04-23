package br.gov.obras.services;

import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.dtos.requests.ArquivoUploadDTO;
import br.gov.obras.entities.AbstractIdentificavel;
import br.gov.obras.entities.ArquivoTipo;
import br.gov.obras.entities.ObrigatoriedadeArquivo;
import br.gov.obras.entities.enums.TipoArquivo;
import br.gov.obras.exceptions.AppException;
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
