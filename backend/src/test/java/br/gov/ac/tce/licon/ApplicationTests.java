package br.gov.ac.tce.licon;

import br.gov.ac.tce.licon.utils.UtilsRequisicaoModificacao;
import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.junit.Assert;

import java.time.LocalDateTime;

@SpringBootTest
class ApplicationTests {
    @Test
    void testIsEntidadeLiconAntigo() {
        LocalDateTime data = LocalDateTime.of(2024, 02, 07, 0, 0, 0);
        Assert.assertEquals(true, UtilsRequisicaoModificacao.isEntidadeLiconAntigo(data));
    }

}
