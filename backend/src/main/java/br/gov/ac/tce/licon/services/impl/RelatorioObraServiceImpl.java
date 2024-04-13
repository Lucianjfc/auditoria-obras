package br.gov.ac.tce.licon.services.impl;

import br.gov.ac.tce.licon.dtos.ArquivoBinarioDTO;
import br.gov.ac.tce.licon.dtos.mapper.ArquivoRelatorioObraToDtoMapper;
import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraDTO;
import br.gov.ac.tce.licon.dtos.requests.ArquivoRelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.entities.*;
import br.gov.ac.tce.licon.entities.enums.TipoArquivoRelatorioObra;
import br.gov.ac.tce.licon.exceptions.AppException;
import br.gov.ac.tce.licon.repositories.RelatorioObraRepository;
import br.gov.ac.tce.licon.services.*;
import br.gov.ac.tce.licon.services.specs.RelatorioObraSpecification;
import com.google.common.collect.ImmutableList;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class RelatorioObraServiceImpl extends AbstractUploadTipoServiceImpl<RelatorioObra, RelatorioObraFiltroRequest, RelatorioObraRepository, ArquivoRelatorioObraFileService, ArquivoRelatorioObra, ArquivoRelatorioObraFiltroRequest, ArquivoRelatorioObraService, ArquivoRelatorioObraDTO, ArquivoRelatorioObraToDtoMapper, TipoArquivoRelatorioObra> implements RelatorioObraService {

    @Autowired
    private RelatorioObraRepository repository;

    @Autowired
    private ArquivoRelatorioObraService arquivoRelatorioObraService;

    @Autowired
    private ArquivoRelatorioObraFileService arquivoRelatorioObraFileService;

    @Autowired
    private ArquivoRelatorioObraToDtoMapper arquivoRelatorioObraToDtoMapper;

    @Autowired
    private ObrigatoriedadeArquivoService obrigatoriedadeArquivoService;

    @Override
    public RelatorioObraRepository getRepository() {
        return repository;
    }

    @Autowired
    private CatalogoObraElasticServiceImpl catalogoObraElasticService;

    @Override
    protected Specification<RelatorioObra> getSpecification(RelatorioObraFiltroRequest filtro) {
        return new RelatorioObraSpecification(filtro);
    }

    @Override
    public RelatorioObra getById(Long id) throws AppException {
        Optional<RelatorioObra> entidadeOpt = getRepository().findById(id);
        if (entidadeOpt.isPresent()) {
            List<ItemObra> itensObra = entidadeOpt.get().getItensObra();
            itensObra = catalogoObraElasticService.getReferenciasByItens(itensObra);
            entidadeOpt.get().setItensObra(itensObra);
            return entidadeOpt.get();
        } else {
            throw new AppException(String.format("Entidade '%s' com ID '%d' não encontrada.", getEntityName(), id), HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ArquivoRelatorioObraService getArquivoService() {
        return this.arquivoRelatorioObraService;
    }

    @Override
    public ArquivoRelatorioObraFileService getFileService() {
        return this.arquivoRelatorioObraFileService;
    }

    @Override
    public ArquivoRelatorioObraToDtoMapper getMapper() {
        return this.arquivoRelatorioObraToDtoMapper;
    }

    @Override
    protected ArquivoRelatorioObra getNewArquivo() {
        return new ArquivoRelatorioObra();
    }

    @Override
    List<ObrigatoriedadeArquivo> getArquivosTiposObrigatorios() {
        return obrigatoriedadeArquivoService.getArquivosObrigatorios("RELATORIO_OBRA", ImmutableList.of("RELATORIO_OBRA"));
    }

    @Override
    protected void preencherDadosEspecificos(ArquivoRelatorioObra arquivoEntity, RelatorioObra entity, ArquivoRelatorioObraDTO arquivoUpload) {
        arquivoEntity.setRelatorioObra(entity);
        super.preencherDadosEspecificos(arquivoEntity, entity, arquivoUpload);
    }

    @Override
    protected void beforeSave(RelatorioObra entity) {
        entity.setDataCadastro(LocalDateTime.now());
    }

    @Override
    @Transactional
    public void importarRelatorio(RelatorioObra relatorioObra, List<ArquivoRelatorioObraDTO> arquivos) {
        validarArquivos(arquivos);
        relatorioObra.setImportado(true);
        relatorioObra.setDataCadastro(LocalDateTime.now());
        RelatorioObra relatorioObraPersisted = this.repository.save(relatorioObra);
        saveArquivos(arquivos, relatorioObraPersisted);
        RelatorioObra relatorio = this.gerarItensImportados(relatorioObraPersisted);
        this.repository.save(relatorio);
    }

    private RelatorioObra gerarItensImportados(RelatorioObra relatorioObra) {
        relatorioObra.setItensObra(new ArrayList<ItemObra>());
        List<ArquivoRelatorioObraDTO> arquivos = this.recuperarArquivos(relatorioObra.getId());
        ArquivoBinarioDTO arquivoBinarioDTO = this.download(arquivos.get(0).getArquivo());
        byte[] binary = arquivoBinarioDTO.getBinario();
        ByteArrayResource resource = new ByteArrayResource(binary);
        try {
            Workbook workbook = new XSSFWorkbook(resource.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            Row rowHeader = sheet.getRow(0);
            Map<Integer, String> columnsPositions = validateHeader(rowHeader);
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    ItemObra itemObraGerado = gerarItem(row, columnsPositions);
                    itemObraGerado.setRelatorioObra(relatorioObra);
                    relatorioObra.getItensObra().add(itemObraGerado);
                }
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        return relatorioObra;
    }

    private ItemObra gerarItem(Row row, Map<Integer, String> positionColumns) {
        ItemObra itemObra = new ItemObra();
        itemObra.setImportado(true);
        for (int columnIndex = 0; columnIndex < row.getLastCellNum(); columnIndex++) {
            Cell cell = row.getCell(columnIndex);
            String currentColumn = positionColumns.get(columnIndex);
            if (currentColumn.equals("CODIGO")) {
                String value = cell.getStringCellValue();
                itemObra.setCodigo(value);
            } else if (currentColumn.equals("DESCRICAO")) {
                String value = cell.getStringCellValue();
                itemObra.setDescricao(value);
            } else if (currentColumn.equals("QUANT")) {
                Integer value = Integer.valueOf((int) cell.getNumericCellValue());
                itemObra.setQuantidade(value);
            } else if (currentColumn.equals("PREÇO_UNITARIO")) {
                BigDecimal value = BigDecimal.valueOf(cell.getNumericCellValue());
                itemObra.setPrecoUnitario(value);
            }
        }
        ItemObra initializedItem = initItemObraElastic(itemObra);
        return initializedItem;
    }

    private ItemObra initItemObraElastic(ItemObra itemObra) {
        return this.catalogoObraElasticService.findItemObra(itemObra);
    }

    private Map<Integer, String> validateHeader(Row row) {
        List<String> columns = ImmutableList.of("CODIGO", "DESCRICAO", "QUANT", "PREÇO_UNITARIO");
        Map<Integer, String> columnIndexMap = new HashMap<>();

        String outputError = "";
        for (String columnName : columns) {
            boolean columnFound = false;
            for (int columnIndex = 0; columnIndex < row.getLastCellNum(); columnIndex++) {
                Cell cell = row.getCell(columnIndex);
                if (cell != null && cell.getStringCellValue().equals(columnName)) {
                    columnFound = true;
                    columnIndexMap.put(columnIndex, columnName);
                    break;
                }
            }
            if (!columnFound) {
                outputError += columnName + ",";
            }
        }

        if (!outputError.isEmpty()) {
            outputError = outputError.substring(0, outputError.length() - 1);
            throw new IllegalArgumentException("As seguintes colunas estão faltando: " + outputError);
        }

        return columnIndexMap;
    }

    @Override
    public List<ArquivoRelatorioObra> saveArquivosReqModificacao(List<ArquivoRelatorioObraDTO> arquivos, RelatorioObra entity) throws AppException {
        return null;
    }
}
