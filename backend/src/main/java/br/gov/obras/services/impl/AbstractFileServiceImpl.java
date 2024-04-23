package br.gov.obras.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

import javax.inject.Inject;

import br.gov.obras.entities.enums.TipoEntidade;
import br.gov.obras.services.DirectoryLocatorService;
import br.gov.obras.entities.Arquivo;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.itextpdf.text.pdf.PdfReader;
import com.j256.simplemagic.ContentInfo;
import com.j256.simplemagic.ContentInfoUtil;
import com.j256.simplemagic.ContentType;

import br.gov.obras.dtos.ArquivoBinarioDTO;
import br.gov.obras.dtos.ArquivoDTO;
import br.gov.obras.exceptions.AppException;
import br.gov.obras.services.FileService;

@Service
public abstract class AbstractFileServiceImpl implements FileService {

    private static final long PAGE_BYTES_LIMITS = 350L * 1024L;
    private static final String PAGE_LIMITS_NAME = "350KB";
    private static final long PDF_BYTES_LIMITS = 70L * 1024L * 1024L;
    private static final String PDF_LIMITS_NAME = "70MB";
    private static final String ERRO_ARQUIVO = "Houve algum erro ao tentar armazenar o arquivo!";
    private static final ContentType[] DEFAULT_TIPOS_VALIDOS = new ContentType[]{ContentType.PDF, ContentType.MICROSOFT_EXCEL, ContentType.MICROSOFT_EXCEL_XML, ContentType.MICROSOFT_WORD, ContentType.MICROSOFT_WORD_XML};

    @Inject
    private ContentInfoUtil util;

    @Inject
    protected DirectoryLocatorService directoryLocatorService;

    @Override
    public ArquivoBinarioDTO download(ArquivoDTO arquivoDTO) throws AppException {
        if (arquivoDTO.ehArquivoDefinitivoValido()) {
            // Recuperar arquivo da pasta definitiva
            Long idArquivo = Long.parseLong(arquivoDTO.getLookupId());
            Arquivo arquivo = lookupArquivoParaDownload(idArquivo);
            return downloadPastaDefinitiva(arquivo);
        } else if (arquivoDTO.ehArquivoTemporarioValido()) {
            // Recuperar arquivo da pasta temporária
            return downloadPastaTemporaria(arquivoDTO);
        } else {
            throw new AppException(String.format("Erro! Formato de lookupId inválido: %s", arquivoDTO.getLookupId()));
        }
    }

    @Override
    public void remover(String arquivoRelativePath) throws AppException {
        // Remover arquivo da pasta definitiva (i.e. BD e sistema de arquivos)
        removerDaPastaDefinitiva(arquivoRelativePath);
    }

    private void removerDaPastaDefinitiva(String arquivoRelativePath) throws AppException {
        Path path = lookupPathArquivoPastaDefinitiva(arquivoRelativePath);
        removerArquivo(path);
    }

    private void removerArquivo(Path path) throws AppException {
        try {
            if (!Files.exists(path)) {
                // Fazer nada, garantindo comportamento idempotente
                return;
            }

            if (Files.isDirectory(path)) {
                throw new AppException("Houve algum erro ao tentar remover o arquivo. Tentando remover um diretório!", HttpStatus.UNPROCESSABLE_ENTITY);
            }

            Files.delete(path);
        } catch (IOException e) {
            throw new AppException("Houve algum erro ao tentar remover o arquivo!");
        }
    }

    protected abstract Arquivo lookupArquivoParaDownload(Long idArquivo) throws AppException;

    private ArquivoBinarioDTO downloadPastaDefinitiva(Arquivo arquivo) throws AppException {
        Path path = lookupPathArquivoPastaDefinitiva(arquivo.getDiretorio());
        return downloadDTO(path, "" + arquivo.getId(), arquivo.getNome(), arquivo.getTipoArquivo());
    }

    private ArquivoBinarioDTO downloadPastaTemporaria(ArquivoDTO arquivoDTO) throws AppException {
        Path path = lookupPathArquivoPastaTemporaria(arquivoDTO);
        return downloadDTO(path, arquivoDTO.getLookupId(), arquivoDTO.getNomeOriginal(), arquivoDTO.getTipoArquivo());
    }

    protected ArquivoBinarioDTO downloadDTO(Path path, String id, String nomeOriginal, String tipoArquivo) throws AppException {
        byte[] binario = download(path, id);
        return ArquivoBinarioDTO.builder().binario(binario).nomeOriginal(nomeOriginal).tipoArquivo(tipoArquivo).build();
    }

    private byte[] download(Path path, String id) throws AppException {
        if (!Files.exists(path) || Files.isDirectory(path)) {
            throw new AppException("Não foi possível encontrar o arquivo no sistema", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        byte[] bytes = null;
        try {
            bytes = Files.readAllBytes(path);
        } catch (IOException e) {
            throw new AppException("Não foi possível fazer o download do arquivo", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return bytes;
    }

    private Path lookupPathArquivoPastaDefinitiva(String arquivoDefinitivoRelativePath) {
        return getFullPathDestinoDefinitivo().resolve(Paths.get(arquivoDefinitivoRelativePath));
    }

    private Path lookupPathArquivoPastaTemporaria(ArquivoDTO arquivoDTO) throws AppException {
        String nomeDestino = criarNomeArquivoAArmazenar(arquivoDTO);
        return getFullPathDestinoTemporario(nomeDestino);
    }

    @Override
    public ArquivoDTO upload(MultipartFile file) throws AppException {
        String lookupId = UUID.randomUUID().toString();
        String nomeOriginal = file.getOriginalFilename();
        String tipoArquivo = file.getContentType();
        ArquivoDTO arquivoDTO = ArquivoDTO.builder().lookupId(lookupId).nomeOriginal(nomeOriginal).tipoArquivo(tipoArquivo).build();
        String nomeDestino = criarNomeArquivoAArmazenar(arquivoDTO);

        // Validar tipo do arquivo
        validarArquivo(file);

        //Criar pasta temporaria caso ela não exista e depois copiar o arquivo para ela
        Path path = getFullPathDestinoTemporario(nomeDestino);
        Path pathParent = path.getParent();
        try {
            if (!Files.exists(pathParent)) {
                Files.createDirectories(pathParent);
            }

            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            throw new AppException(ERRO_ARQUIVO, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ArquivoDTO.builder().nomeOriginal(nomeOriginal).lookupId(lookupId).tipoArquivo(tipoArquivo).build();
    }

    private void validarArquivo(MultipartFile file) throws AppException {
        // Extrair conteúdo do arquivo
        byte[] contents;
        try {
            contents = file.getBytes();
        } catch (IOException e) {
            throw new AppException("Não foi possível recuperar os bytes do arquivo.", e);
        }

        // Extrair extensão do arquivo baseado no conteúdo
        ContentInfo info = util.findMatch(contents);
        if (info == null) {
            info = ContentInfo.EMPTY_INFO;
        }
        ContentType contentType = info.getContentType();

        // Validar tipo de arquivo (default: PDF, DOC ou XLS apenas, com respectivas variações)
        if (!temTipoDeConteudoValido(contentType)) {
            throw new AppException(String.format("O conteúdo do arquivo não é válido ou está corrompido. Tipo do arquivo: %s", contentType == ContentType.EMPTY ? "<desconhecido>" : contentType.getSimpleName()), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // Executar validações específicas caso seja PDF
        if (contentType == ContentType.PDF) {
            validarArquivoPDF(contents, file.getOriginalFilename());
        }
    }

    private boolean temTipoDeConteudoValido(ContentType contentType) {
        for (ContentType tipoValido : tiposValidos()) {
            if (contentType == tipoValido) {
                return true;
            }
        }
        return false;
    }

    protected ContentType[] tiposValidos() {
        // XXX: sobrescrever este método caso seja necessário personalizar
        return DEFAULT_TIPOS_VALIDOS;
    }

    private void validarArquivoPDF(byte[] contents, String name) throws AppException {
        // Validar tamanho do PDF
        if (contents.length > PDF_BYTES_LIMITS) {
            throw new AppException(String.format("O arquivo PDF %s excede o limite de %s.", name, PDF_LIMITS_NAME), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // Extrair número de páginas do PDF
        int numberOfPages = extrairNumeroDePaginas(contents);

        // Validar tamanho por número de páginas do PDF
        if ((contents.length / numberOfPages) > PAGE_BYTES_LIMITS) {
            throw new AppException(String.format("A média do tamanho da página do PDF %s excede o limite de %s.", name, PAGE_LIMITS_NAME), HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    private int extrairNumeroDePaginas(byte[] contents) throws AppException {
        int numberOfPages = 0;
        try {
            numberOfPages = extrairNumeroDePaginasViaItext(contents);
        } catch (NoClassDefFoundError e) {
            try {
                numberOfPages = extrairNumeroDePaginasViaPdfbox(contents);
            } catch (IOException e2) {
                throw new AppException("O PDF informado é inválido, este apresenta erro ao realizar leitura dos dados!", e2);
            }
        } catch (IOException e) {
            throw new AppException("Não foi possível ler o conteúdo do arquivo PDF.", e);
        }

        return numberOfPages;
    }

    private int extrairNumeroDePaginasViaItext(byte[] contents) throws IOException {
        PdfReader reader = new PdfReader(contents);
        return reader.getNumberOfPages();
    }

    private int extrairNumeroDePaginasViaPdfbox(byte[] contents) throws IOException {
        PDDocument pdDocument = PDDocument.load(contents);
        return pdDocument.getNumberOfPages();
    }

    protected String criarNomeArquivoAArmazenar(ArquivoDTO arquivoDTO) throws AppException {
        String lookupId = arquivoDTO.getLookupId();
        String nomeOriginal = arquivoDTO.getNomeOriginal();
        String fileNameExtension = StringUtils.getFilenameExtension(nomeOriginal);
        if (fileNameExtension == null) {
            throw new AppException(String.format("Não foi possível extrair a extensão do arquivo: %s", nomeOriginal), HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return lookupId + "." + fileNameExtension;
    }

    protected Path getFullPathDestinoDefinitivo() {
        return directoryLocatorService.getFullPathDestinoDefinitivo();
    }

    protected Path getFullPathDestinoTemporario(String nomeDestino) {
        return directoryLocatorService.getFullPathDestinoTemporario(nomeDestino);
    }

    private static Path extrairPathRaiz(Path raiz, Path path) throws AppException {
        if (!path.startsWith(raiz)) {
            throw new AppException("Erro! Path raiz não contém o path a ser extraído.", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return path.subpath(raiz.getNameCount(), path.getNameCount());
    }

    protected void preencherMetadados(Path fullPathDestinoDefinitivo, ArquivoDTO arquivoDTO, Arquivo arquivo) throws AppException {
        String diretorio = extrairPathRaiz(getFullPathDestinoDefinitivo(), fullPathDestinoDefinitivo).toString();
        String nome = arquivoDTO.getNomeOriginal();
        String tipo = arquivoDTO.getTipoArquivo();

        arquivo.setDiretorio(diretorio);
        arquivo.setNome(nome);
        arquivo.setTipoArquivo(tipo);
        arquivo.setDataEnvio(LocalDateTime.now());
    }

    protected void copiarParaLocalDefinitivo(Path fullPathDestinoDefinitivo, ArquivoDTO arquivoDTO, Arquivo arquivo) throws AppException {
        // Checar se o arquivo temporário ainda existe
        String lookupId = arquivoDTO.getLookupId();
        String nomeDestinoTemporario = criarNomeArquivoAArmazenar(arquivoDTO);
        Path fullPathDestinoTemporario = getFullPathDestinoTemporario(nomeDestinoTemporario);

        if (!Files.exists(fullPathDestinoTemporario) || Files.isDirectory(fullPathDestinoTemporario)) {
            throw new AppException(String.format("Arquivo temporário inexistente/inválido! Lookup ID: %s", lookupId), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // Copiar para o local de destino
        try {
            String nomeDestinoDefinitivo = nomeDestinoTemporario;

            if (Files.exists(fullPathDestinoDefinitivo)) {
                throw new AppException(String.format("Arquivo já existe no destino: %s", nomeDestinoDefinitivo), HttpStatus.UNPROCESSABLE_ENTITY);
            }

            Files.copy(fullPathDestinoTemporario, fullPathDestinoDefinitivo);

            this.preencherMetadados(fullPathDestinoDefinitivo, arquivoDTO, arquivo);
        } catch (IOException e) {
            throw new AppException(ERRO_ARQUIVO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    protected Path getFullPathDestino(Long idEntity, ArquivoDTO arquivoDTO) throws AppException {
        if (idEntity == null) {
            throw new AppException(String.format("%s inválido(a), ID não informado!", getTipoEntidade().getValor()), HttpStatus.UNPROCESSABLE_ENTITY);
        }
        String folderPath = String.format("%sID_%d", org.apache.commons.lang3.StringUtils.stripAccents(getTipoEntidade().getValor()), idEntity);

        String nomeDestino = criarNomeArquivoAArmazenar(arquivoDTO);

        return directoryLocatorService.getFullPathEntidade(getTipoEntidade()).resolve(Paths.get(folderPath, nomeDestino));
    }

    public void copiarParaLocalDefinitivo(Long idEntity, ArquivoDTO arquivoDTO, Arquivo arquivo) throws AppException {
        Path fullPathDestinoDefinitivo = this.getFullPathDestino(idEntity, arquivoDTO);

        // Criar pasta da entidade, caso ela não exista
        Path fullPathDestinoDefinitivoParent = fullPathDestinoDefinitivo.getParent();
        try {
            if (!Files.exists(fullPathDestinoDefinitivoParent)) {
                Files.createDirectories(fullPathDestinoDefinitivoParent);
            }
        } catch (IOException e) {
            throw new AppException(ERRO_ARQUIVO, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.copiarParaLocalDefinitivo(fullPathDestinoDefinitivo, arquivoDTO, arquivo);
    }

    protected abstract TipoEntidade getTipoEntidade();

}
