package br.gov.obras.dtos.requests;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
public class RelatorioObraFiltroRequest extends AbstractFiltroRequest {

        private String titulo;

        private String observacao;

        private LocalDateTime dataAnalise;

}
