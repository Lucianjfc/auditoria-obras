const UrlRouter = {
  auditoria: {
    default: '/',
    relatorioObra: {
      index: '/',
      listagem: '/listagem-relatorios',
      novo: '/relatorio-obra/novo',
      editar: '/relatorio-obra/editar/:id',
    },
  },
};

export default UrlRouter;
