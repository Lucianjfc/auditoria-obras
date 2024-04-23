package br.gov.obras.services;
import br.gov.obras.dtos.requests.ObrigatoriedadeArquivoFiltroRequest;
import br.gov.obras.entities.ObrigatoriedadeArquivo;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Transactional
public interface ObrigatoriedadeArquivoService extends IService<ObrigatoriedadeArquivo, ObrigatoriedadeArquivoFiltroRequest> {

    List<ObrigatoriedadeArquivo> getArquivosObrigatorios(String tipoProcesso, List<String> filtros);
}
