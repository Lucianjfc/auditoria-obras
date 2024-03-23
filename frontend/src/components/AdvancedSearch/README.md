# AsyncDropdown

Componente de encapsulamento do Dropdown para chamadas à outras entidades. Deve possuir um store com instância de `AsyncDropdownStore` sendo passado.

## Props

| Propriedade | Valor Padrão | Descrição                                                                                              |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| id          | -            | Identificador do formulário (atributo). _OBS: Passado automático ao ser envolvido por um `FormField`._ |
| value       | -            | Valor da chave da entidade a ser exibida pelo `Dropdown`                                               |
| onChange    | -            | Função a ser chamada ao haver alteração de seleção.                                                    |
| store       | -            | Instância do `AsyncDropdownStore` que armazena os dados e a listagem exibida no `Dropdown`.            |
