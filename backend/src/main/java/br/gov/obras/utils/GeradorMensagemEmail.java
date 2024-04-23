package br.gov.obras.utils;

public class GeradorMensagemEmail {

    public static String getMensagemCadastroContrato() {
        return "<p>" +
                "<p>Prezado(a) <strong> %s </strong>, esse é um email de confirmação referente a criação de um Contrato em <strong> %s </strong></p>" +
                "<p>Nº:<strong> %s </strong></p>" +
                "<p>Objeto: <strong> %s </strong></p>" +
                "</p>";
    }

    public static String getMensagemCadastroLicitacao() {
        return "<p>" +
                "<p>Prezado(a) <strong> %s </strong>, esse é um email de confirmação referente a criação de uma Licitação em <strong> %s </strong></p>" +
                "<p>Nº:<strong> %s </strong></p>" +
                "<p>Ano:<strong> %s </strong></p>" +
                "<p>Modalidade:<strong> %s </strong></p>" +
                "<p>Naturezas: <strong> %s </strong></p>" +
                "</p>";
    }

    public static String getMensagemCadastroCarona() {
        return "<p>" +
                "<p>Prezado(a) <strong> %s </strong>, esse é um email de confirmação referente a criação de uma Adesão/Carona em <strong> %s </strong></p>" +
                "<p>Modalidade:<strong> %s </strong></p>" +
                "<p>Nº:<strong> %s </strong></p>" +
                "<p>Natureza: <strong> %s </strong></p>" +
                "<p>Objeto:<strong> %s </strong></p>" +
                "</p>";
    }

    public static String getMensagemCadastroInexigibilidade() {
        return "<p>" +
                "<p>Prezado(a) <strong> %s </strong>, esse é um email de confirmação referente a criação de uma Inexigibilidade em <strong> %s </strong></p>" +
                "<p>Nº:<strong> %s </strong></p>" +
                "<p>Natureza: <strong> %s </strong></p>" +
                "<p>Objeto:<strong> %s </strong></p>" +
                "</p>";
    }
}
