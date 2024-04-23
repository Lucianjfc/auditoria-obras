package br.gov.obras.services.specs;

import br.gov.obras.dtos.requests.ArquivoRelatorioObraFiltroRequest;
import br.gov.obras.entities.ArquivoRelatorioObra;
import br.gov.obras.entities.ArquivoTipo_;
import br.gov.obras.entities.Arquivo_;
import lombok.AllArgsConstructor;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ArquivoRelatorioObraSpecification implements ISpecification<ArquivoRelatorioObra> {

    private static final long serialVersionUID = -695662401577903596L;

    private final ArquivoRelatorioObraFiltroRequest filtro;

    @Override
    public Predicate toPredicate(Root<ArquivoRelatorioObra> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicados = new ArrayList<>();

        addIfExists(getPredicate(root.get(Arquivo_.nome), filtro.getNome(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(Arquivo_.descricao), filtro.getDescricao(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(Arquivo_.tipoArquivo), filtro.getTipoArquivo(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(Arquivo_.dataEnvio), filtro.getDataEnvio(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(Arquivo_.diretorio), filtro.getDiretorio(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(ArquivoTipo_.tipo), filtro.getTipoArquivoRelatorioObra(), builder, filtro.getFilterType()), predicados);

        return builder.and(predicados.toArray(new Predicate[0]));
    }
}
