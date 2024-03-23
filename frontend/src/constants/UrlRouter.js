const UrlRouter = {
  auditoria: {
    default: '/relatorio-obra',
    relatorioObra: {
      index: '/relatorio-obra',
      listagem: '/relatorio-obra/listagem-relatorios',
      novo: '/relatorio-obra/novo',
      editar: '/relatorio-obra/editar/:id',
    },
  },
};

export default UrlRouter;
