package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.dtos.ArquivoBinarioDTO;
import br.gov.ac.tce.licon.dtos.ArquivoDTO;
import br.gov.ac.tce.licon.dtos.mapper.EntityToDtoMapper;
import br.gov.ac.tce.licon.dtos.requests.AbstractFiltroRequest;
import br.gov.ac.tce.licon.dtos.requests.ArquivoMappedSuperclassDTO;
import br.gov.ac.tce.licon.entities.AbstractIdentificavel;
import br.gov.ac.tce.licon.entities.ArquivoIdentificavel;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.repositories.IRepository;
import br.gov.ac.tce.licon.services.AbstractUploadService;
import br.gov.ac.tce.licon.services.ArquivoUploadService;
import br.gov.ac.tce.licon.services.FileService;
import lombok.AccessLevel;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter(value = AccessLevel.PROTECTED)
public abstract class AbstractUploadServiceImpl<E extends AbstractIdentificavel, F extends AbstractFiltroRequest, R extends IRepository<E>, FS extends FileService, AT extends ArquivoIdentificavel, ATF extends AbstractFiltroRequest, AS extends ArquivoUploadService<AT, ATF>, AU extends ArquivoMappedSuperclassDTO, M extends EntityToDtoMapper<AT, AU>> extends AbstractService<E, F, R> implements AbstractUploadService<E, F, AU, AT> {

    public abstract AS getArquivoService();

    public abstract FS getFileService();

    public abstract M getMapper();

    @Override
    public ArquivoDTO upload(MultipartFile file) throws AppException {
        return getFileService().upload(file);
    }

    @Override
    public ArquivoBinarioDTO download(ArquivoDTO arquivoDTO) throws AppException {
        return getFileService().download(arquivoDTO);
    }

    @Override
    public void removerArquivo(Long idEntity, Long idArquivo) throws AppException {
        // Remover do BD
        // Está armazenado no BD, então temos que remover de lá

        AT arquivo = this.getArquivoService().getById(idArquivo);
        if (!idEntity.equals(arquivo.getIdEntidade())) {
            throw new AppException(String.format("Erro! Não foi possível remover. Arquivo não pertence à/ao %s!", getEntityName()), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        this.getArquivoService().remover(idArquivo);

        // Remover do Sistema de Arquivos
        String arquivoRelativePath = arquivo.getDiretorio();
        getFileService().remover(arquivoRelativePath);
    }

    public List<AU> recuperarArquivos(Long idEntity) throws AppException  {
        // Recuperar entidades
        List<AT> resultado = this.getArquivoService().buscarPor(idEntity);

        // Transformar no DTO
        return resultado.stream()
                .map(getMapper()::map)
                .collect(Collectors.toList());
    }

    @Override
    public List<AT> saveArquivos(List<AU> arquivos, E entity) throws AppException {
        List<AT> result = new ArrayList<>();

        List<AU> arquivosPersistidos =  recuperarArquivos(entity.getId());

        for (AU arquivoOriginal : arquivosPersistidos) {
            AU arquivoNovo = arquivos.stream().filter(arquivo -> arquivoOriginal.getIdArquivo().equals(arquivo.getIdArquivo())).findFirst().orElse(null);
            if (arquivoNovo == null) {
                removerArquivo(entity.getId(), arquivoOriginal.getIdArquivo());
            }
        }

        for (AU arquivoUpload : arquivos) {
            if (arquivoUpload.getArquivo().ehArquivoTemporarioValido()) {
                ArquivoDTO arquivoDTO = arquivoUpload.getArquivo();
                AT arquivoEntity = getNewArquivo();
                arquivoEntity.setDescricao(arquivoUpload.getDescricao());

                this.preencherDadosEspecificos(arquivoEntity, entity, arquivoUpload);

                this.copiarParaLocalDefinitivo(entity, arquivoDTO, arquivoEntity);
                this.getArquivoService().save(arquivoEntity);
                result.add(arquivoEntity);
            } else {
                atualizarArquivo(entity.getId(), arquivoUpload);
            }
        }

        return result;
    }
    void copiarParaLocalDefinitivo(E entity, ArquivoDTO dto, AT arquivoEntity) {
        this.getFileService().copiarParaLocalDefinitivo(entity.getId(), dto, arquivoEntity);
    }

    protected abstract AT getNewArquivo();

    protected abstract void preencherDadosEspecificos(AT arquivoEntity, E entity, AU arquivoUpload);

    @Override
    public AU atualizarArquivo(Long idEntidade, AU arquivoUploadDTO) throws AppException  {

        // Recuperar ArquivoLicitacao armazenado
        Long idArquivo = Objects.requireNonNull(arquivoUploadDTO.getIdArquivo(), "idArquivo deve ser diferente de nulo!");
        final AT arquivoEntity = this.getArquivoService().getById(idArquivo);

        // Validar se o arquivo pertence à entidade
        if (!idEntidade.equals(arquivoEntity.getIdEntidade())) {
            throw new AppException(String.format("Erro! Não foi possível atualizar. Arquivo não pertence à/ao %s!", getEntityName()));
        }

        E entity = getById(idEntidade);

        // Atualizar dados básicos
        arquivoEntity.setDescricao(arquivoUploadDTO.getDescricao());

        preencherDadosEspecificos(arquivoEntity, entity, arquivoUploadDTO);

        // Atualizar arquivo físico, caso necessário
        ArquivoDTO arquivoDTO = arquivoUploadDTO.getArquivo();
        if (arquivoDTO != null && arquivoDTO.ehArquivoTemporarioValido()) {
            this.getFileService().copiarParaLocalDefinitivo(idEntidade, arquivoDTO, arquivoEntity);
        }

        // Salvar alterações
        this.getArquivoService().save(arquivoEntity);

        return this.getMapper().map(arquivoEntity);
    }

}
