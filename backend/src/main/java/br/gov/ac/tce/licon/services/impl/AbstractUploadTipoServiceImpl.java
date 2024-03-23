package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.dtos.ArquivoDTO;
import br.gov.ac.tce.licon.dtos.mapper.EntityToDtoMapper;
import br.gov.ac.tce.licon.dtos.requests.*;
import br.gov.ac.tce.licon.dtos.requests.advancedSearch.AdvancedSearchRequest;
import br.gov.ac.tce.licon.entities.*;
import br.gov.ac.tce.licon.entities.enums.TipoArquivo;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.repositories.IRepository;
import br.gov.ac.tce.licon.services.AbstractUploadTipoService;
import br.gov.ac.tce.licon.services.FileService;
import br.gov.ac.tce.licon.services.ArquivoUploadTipoService;
import lombok.AccessLevel;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter(value = AccessLevel.PROTECTED)
public abstract class AbstractUploadTipoServiceImpl<E extends AbstractIdentificavel, F extends AbstractFiltroRequest, R extends IRepository<E>, FS extends FileService, AT extends ArquivoTipo<EA>, ATF extends AbstractFiltroRequest, AS extends ArquivoUploadTipoService<AT, ATF, EA>, AU extends ArquivoUploadDTO<EA>, M extends EntityToDtoMapper<AT, AU>, EA extends TipoArquivo> extends AbstractUploadServiceImpl<E, F, R, FS, AT, ATF, AS, AU, M> implements AbstractUploadTipoService<E, F, AU, EA, AT> {

    @Override
    public void validarArquivos(List<AU> arquivos) {
        List<EA> tiposArquivosEnviados = extrairTiposArquivos(arquivos);
        this.verificarDescricaoTipoOutros(arquivos);
        this.verificarArquivosObrigatorios(tiposArquivosEnviados, null);
    }

    @Override
    public void verificarDescricaoTipoOutros(List<AU> arquivos) {
        arquivos.forEach(a -> {
            if (("OUTROS_DOCUMENTOS".equals(a.getTipo().getTipo())) && (a.getDescricao() == null || a.getDescricao().isEmpty())) {
                throw new AppException("Arquivos do tipo 'Outros Documentos' devem possuir descrição.", HttpStatus.UNPROCESSABLE_ENTITY);

            }
        });
    }

    protected List<EA> extrairTiposArquivos(List<AU> arquivos) {
        return arquivos.stream().map(AU::getTipo).collect(Collectors.toList());
    }

    @Override
    public void verificarArquivosObrigatorios(List<EA> tiposArquivosEnviados, List<ObrigatoriedadeArquivo> obrigatoriedades) throws AppException {
        if (obrigatoriedades == null) {
            obrigatoriedades = getArquivosTiposObrigatorios();
        }
        List<String> arquivosQueFaltam = obrigatoriedades.stream().map(ObrigatoriedadeArquivo::getArquivo).collect(Collectors.toList());
        arquivosQueFaltam.removeAll(tiposArquivosEnviados.stream().map(EA::getValor).collect(Collectors.toList()));

        if (arquivosQueFaltam.size() == 1) {
            throw new AppException(String.format("Deve ser inserido ao menos um arquivo do tipo %s à/ao %s.", arquivosQueFaltam.get(0), getEntityName()), HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (arquivosQueFaltam.size() > 1) {
            StringBuilder arquivos = new StringBuilder(arquivosQueFaltam.get(0));
            int size = arquivosQueFaltam.size();

            for (int i = 1; i < size; i++) {
                String separador = (i == size - 1) ? " e " : ", ";
                arquivos.append(separador).append(arquivosQueFaltam.get(i));
            }

            throw new AppException("Deve ser inserido ao menos um arquivo dos tipos " + arquivos + ".", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    abstract List<ObrigatoriedadeArquivo> getArquivosTiposObrigatorios();

    @Override
    protected void preencherDadosEspecificos(AT arquivoEntity, E entity, AU arquivoUpload) {
        arquivoEntity.setTipo(arquivoUpload.getTipo());
    }

    @Override
    public AU atualizarArquivo(Long idEntidade, AU arquivoUploadDTO, boolean validarArquivos) throws AppException {

        // Recuperar ArquivoLicitacao armazenado
        Long idArquivo = Objects.requireNonNull(arquivoUploadDTO.getIdArquivo(), "idArquivo deve ser diferente de nulo!");
        final AT arquivoEntity = this.getArquivoService().getById(idArquivo);

        // Validar se o arquivo pertence à entidade
        if (!idEntidade.equals(arquivoEntity.getIdEntidade())) {
            throw new AppException(String.format("Erro! Não foi possível atualizar. Arquivo não pertence à/ao %s!", getEntityName()));
        }

        if (validarArquivos) {
            // Validar se a ENTIDADE continua consistente, de acordo com os arquivos obrigatórios.
            // Carregar todos os arquivos do BD, mas considerar o que está sendo alterado em memória durante a validação.
            List<AT> arquivosEntidade = this.getArquivoService().buscarPor(idEntidade);
            List<EA> tiposArquivosEnviados = arquivosEntidade.stream().map(arq -> {
                if (arq.getId().equals(arquivoEntity.getId())) {
                    return arquivoEntity;
                }
                return arq;
            }).map(AT::getTipo).collect(Collectors.toList());

            this.verificarArquivosObrigatorios(tiposArquivosEnviados, getArquivosTiposObrigatorios());

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

    protected void inicializaFiltro(AdvancedSearchRequest filtro) {
        Page page = new Page();
        page.setIndex(1);
        page.setSize(20);
        filtro.setAndParameters(new ArrayList<>());
        filtro.setOrParameters(new ArrayList<>());
        filtro.setFilterType(FilterType.SEARCH);
        filtro.setPage(page);
    }
}
