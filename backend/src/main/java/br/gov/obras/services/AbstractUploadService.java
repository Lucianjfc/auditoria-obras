package br.gov.obras.services;

import br.gov.obras.dtos.ArquivoBinarioDTO;
import br.gov.obras.dtos.ArquivoDTO;
import br.gov.obras.dtos.requests.AbstractFiltroRequest;
import br.gov.obras.dtos.requests.ArquivoMappedSuperclassDTO;
import br.gov.obras.entities.ArquivoIdentificavel;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.entities.AbstractIdentificavel;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Transactional
public interface AbstractUploadService<E extends AbstractIdentificavel, F extends AbstractFiltroRequest, AU extends ArquivoMappedSuperclassDTO, AT extends ArquivoIdentificavel> extends IService<E, F> {

    ArquivoDTO upload(MultipartFile file) throws AppException;

    ArquivoBinarioDTO download(ArquivoDTO arquivoDTO) throws AppException;

    void removerArquivo(Long idEntity, Long idArquivo) throws AppException;

    List<AU> recuperarArquivos(Long idEntity);

    AU atualizarArquivo(Long idEntity, AU arquivoUploadDTO);

    List<AT> saveArquivos(List<AU> arquivos, E entity) throws AppException;

    List<AT> saveArquivosReqModificacao(List<AU> arquivos, E entity) throws AppException;

}
