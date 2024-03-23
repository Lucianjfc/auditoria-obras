# FileUpload

Componente que auxilia no agrupamento de conteúdo com guias.

## Props

| Propriedade    | Valor Padrão | Descrição                                                                                                                                                                                                                     |
| -------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tabs           | `[]`         | Lista de tabs que deve ser representada por um state, cada tab sendo representada por um objeto podendo possuir as seguintes propriedades: `header`, `content`, `closeable`. Por default a propriedade `closeable` é `false`. |
| onClose        | -            | Função responsável por remover a guia fechada do state das Tabs.                                                                                                                                                              |
| activeTabIndex | 0            | Index da Tab ativa.                                                                                                                                                                                                           |
| onChangeTab    | -            | Função responsável por alterar a Tab ativa, ela recebe como parâmetro a nova Tab que será marcada como ativa.                                                                                                                 |
| fixedFirstTab  | `false`      | Indica se o componente deverá funcionar no modo modo em que a primeira Tab ficará fixada de forma que não saia da listagem independente da quantidade de Tabs adicionadas.                                                    |
| badgeSeverity  | `danger`     | Muda a cor da badge de acordo com a Severity.                                                                                                                                                                                 |
