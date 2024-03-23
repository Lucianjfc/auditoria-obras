# FormField

Componente de encapsulamento de campos de formulário, já aplicando lógicas de validação.

## Props

| Propriedade | Valor Padrão | Descrição                                                                                                           |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| columns     | `12`         | Número de colunas do grid do formulário.                                                                            |
| attribute   | -            | Atributo do `object` a ser acessado pelo formulário.                                                                |
| label       | -            | Título do campo de formulário.                                                                                      |
| rule        | `{}`         | Objeto que contém a regra do campo de formulário.                                                                   |
| submitted   | `false`      | Estado de submissão fomulário (já houve tentativa de sumissão ou não - utilizado para exibir a validação da regra). |
| checkbox    | `false`      | Informa se o componente de formulário em questão é um checkbox.                                                     |
