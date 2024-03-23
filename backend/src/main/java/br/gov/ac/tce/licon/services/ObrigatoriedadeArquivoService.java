package br.gov.ac.tce.licon.services;
import br.gov.ac.tce.licon.dtos.requests.ObrigatoriedadeArquivoFiltroRequest;
import br.gov.ac.tce.licon.entities.ObrigatoriedadeArquivo;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Transactional
public interface ObrigatoriedadeArquivoService extends IService<ObrigatoriedadeArquivo, ObrigatoriedadeArquivoFiltroRequest> {

    List<ObrigatoriedadeArquivo> getArquivosObrigatorios(String tipoProcesso, List<String> filtros);
}
