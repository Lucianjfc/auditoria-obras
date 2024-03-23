package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoDeUF implements EnumValor {

        ACRE("AC"),
        AL("ALAGOAS"),
        AP("AMAPÁ"),
        AM("AMAZONAS"),
        BA("BAHIA"),
        CE("CEARÁ"),
        DF("DISTRITO FEDERAL"),
        ES("ESPÍRITO SANTO"),
        GO("GOIÁS"),
        MA("MARANHÃO"),
        MT("MATO GROSSO"),
        MS("MATO GROSSO DO SUL"),
        MG("MINAS GERAIS"),
        PA("PARÁ"),
        PB("PARAÍBA"),
        PR("PARANÁ"),
        PE("PERNAMBUCO"),
        PI("PIAUÍ"),
        RJ("RIO DE JANEIRO"),
        RN("RIO GRANDE DO NORTE"),
        RS("RIO GRANDE DO SUL"),
        RO("RONDÔNIA"),
        RR("RORAIMA"),
        SC("SANTA CATARINA"),
        SP("SÃO PAULO"),
        SE("SERGIPE"),
        TO("TOCANTINS");

        private String valor;

        TipoDeUF(String valor) {
                this.valor = valor;
        }

    }
