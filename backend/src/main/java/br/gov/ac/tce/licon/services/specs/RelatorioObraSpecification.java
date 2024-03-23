package br.gov.ac.tce.licon.services.specs;

import br.gov.ac.tce.licon.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.ac.tce.licon.entities.RelatorioObra;
import br.gov.ac.tce.licon.entities.RelatorioObra_;
import lombok.AllArgsConstructor;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class RelatorioObraSpecification implements ISpecification<RelatorioObra> {

    private static final long serialVersionUID = 4773106106434275129L;

    private final RelatorioObraFiltroRequest filtro;

    @Override
    public Predicate toPredicate(Root<RelatorioObra> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicados = new ArrayList<>();

        addIfExists(getPredicate(root.get(RelatorioObra_.titulo), filtro.getTitulo(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(RelatorioObra_.observacao), filtro.getObservacao(), builder, filtro.getFilterType()), predicados);
        addIfExists(getPredicate(root.get(RelatorioObra_.dataAnalise), filtro.getDataAnalise(), builder, filtro.getFilterType()), predicados);

        return builder.and(predicados.toArray(new Predicate[0]));
    }

}
