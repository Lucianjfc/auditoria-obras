import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Dropdown } from 'primereact/dropdown';
import './style.scss';
import FcButton from '~/components/FcButton';
import SearchOperators from './SearchOperators';
import SearchTypes from './SearchTypes';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import AsyncDropdown from '../AsyncDropdown';
import { computed, toJS } from 'mobx';
import moment from 'moment';
import { AutoComplete } from 'primereact/autocomplete';
import { DATE_FORMAT, DATE_FORMAT_WITH_HOURS, DATE_PARSE_FORMAT, DATE_PARSE_FORMAT_WITH_HOURS } from '../../utils/date';
import Tooltip from '../Tooltip';
import { Divider } from 'primereact/divider';
import { ToggleButton } from 'primereact/togglebutton';
import { Sidebar } from 'primereact/sidebar';
import { isDesktop } from '../../utils/utils';
import RightBarContext from '../../contexts/RightBarContext';
import { ConfirmDialog } from 'primereact/confirmdialog';

@observer
class AdvancedSearch extends React.Component {
  searchParams = [];

  static contextType = RightBarContext;

  constructor(props) {
    super(props);
    this.searchParams = props.searchParams;

    this.searchParams.forEach((item, idx) => {
      if (item && !item.key) {
        item.key = idx;
      }
    });

    this.state = {
      visible: false,
      selected: [],
      collapsed: true,
      showFilters: false,
      selectedField: null,
      actualFilter: {
        id: '',
        field: '',
        operator: '',
        value: undefined,
        formatted: '-',
        invisible: '',
        completeParam: '',
        fieldKey: '',
        fixed: '',
      },
      text: '',
      filtersCount: 0,
      showAllValues: false,
    };

    this._toggleCollapsed = this._toggleCollapsed.bind(this);
    this._clearForm = this._clearForm.bind(this);
    this._addFilter = this._addFilter.bind(this);
    this._removeElement = this._removeElement.bind(this);
    this._editElement = this._editElement.bind(this);
    this._beforeSuggest = this._beforeSuggest.bind(this);
    this._addFilterSuggestRecursive = this._addFilterSuggestRecursive.bind(this);
    this._setField = this._setField.bind(this);
    this._getValueField = this._getValueField.bind(this);
    this._disableAddFilter = this._disableAddFilter.bind(this);
    this._renderSideBar = this._renderSideBar.bind(this);
    this._renderSideBarContent = this._renderSideBarContent.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidUpdate(_, prevState) {
    const sortedParamList = this.searchParams.sort((p1, p2) => p1.label?.length - p2.label?.length);
    const params = [];
    let maxLineLength = 0;
    sortedParamList.forEach((p, i) => {
      let lineLength = 0;
      if (i < sortedParamList.length / 2) {
        params.push(p);
        lineLength += p.label?.length;
      }
      if (i < (sortedParamList.length - 1) / 2) {
        params.push(sortedParamList[sortedParamList.length - i - 1]);
        lineLength += sortedParamList[sortedParamList.length - i - 1]?.label?.length;
      }
      if (lineLength > maxLineLength) {
        maxLineLength = lineLength;
      }
    });

    if (JSON.stringify(this.state) !== JSON.stringify(prevState) && !this.state.actualFilter.suggest) {
      this.context.setRightBarContent(this._renderSideBarContent(params));
    }
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  componentDidMount() {
    this.unlisten = this.context?.historyState?.listen(() => {
      this.setState({ showFilters: false });
      this.context?.setRightBarActive(false);
    });
    const { filterSuggest } = this.props;
    this.props.store.setSearchText('');

    const storagedFilters = Object.values(JSON.parse(localStorage.getItem(this.getStorageKey())) ?? {});
    this.suggestions = storagedFilters
      .filter((filter) => this.searchParams.find((param) => param.field === filter.param.field))
      .sort((f1, f2) => f2.count - f1.count)
      .map((filter) => filter.param)
      .slice(0, 6);
    const initialId = this.state.filtersCount + 1;
    this.suggestions?.forEach((filter, i) => (filter.id = initialId + i));
    this.setState({ filtersCount: initialId + this.suggestions?.length ?? 0 });

    if (filterSuggest && filterSuggest.length > 0) {
      this._addFilterSuggestRecursive(filterSuggest, 0);
    } else {
      this._callSearch();
    }
  }

  _addFilterSuggestRecursive(filterSuggest, iterator) {
    this.setState(
      {
        actualFilter: {
          id: filterSuggest[iterator].id,
          field: filterSuggest[iterator].field,
          operator: filterSuggest[iterator].operator,
          value: filterSuggest[iterator].value,
          formatted: filterSuggest[iterator].formatted,
          invisible: filterSuggest[iterator].invisible,
          completeParam: filterSuggest[iterator].completeParam,
          fixed: filterSuggest[iterator].fixed,
          suggest: true,
        },
      },
      () => {
        if (iterator === filterSuggest.length - 1) {
          this._addFilter(true);
          this._callSearch();
        } else {
          this._addFilter(true);
          this._addFilterSuggestRecursive(filterSuggest, iterator + 1);
        }
      }
    );
  }

  _toggleShowFilters() {
    let callback;
    if (!this.state.collapsed) {
      callback = () => this._toggleCollapsed();
    }
    this.setState((oldState) => ({ showFilters: !oldState.showFilters }), callback);
  }

  _toggleCollapsed() {
    this.setState(
      (oldState) => ({ collapsed: !oldState.collapsed }),
      () => {
        if (this.state.collapsed) {
          this._clearForm();
        }
      }
    );
  }

  _clearForm() {
    this.setState({
      collapsed: true,
      actualFilter: {
        id: '',
        field: '',
        operator: '',
        value: undefined,
        formatted: '-',
        invisible: '',
        completeParam: '',
        fieldKey: '',
        fixed: '',
      },
    });
  }

  _addFilter(isFilterSuggest = false) {
    const { selected, actualFilter } = this.state;

    actualFilter.completeValue = actualFilter.value;
    if ([SearchTypes.DATE.value, SearchTypes.DATE_TIME.value].includes(actualFilter.completeParam.type.value)) {
      const { dateFormat, dateParse } =
        actualFilter.completeParam.type.value === SearchTypes.DATE.value
          ? { dateFormat: DATE_FORMAT, dateParse: DATE_PARSE_FORMAT }
          : { dateFormat: DATE_FORMAT_WITH_HOURS, dateParse: DATE_PARSE_FORMAT_WITH_HOURS };
      actualFilter.formatted = actualFilter.value ? actualFilter.value.format(dateFormat) : actualFilter.value;
      actualFilter.value = actualFilter.value ? actualFilter.value.format(dateParse) : actualFilter.value;
    } else if (actualFilter.completeParam.type.value === SearchTypes.ENUM.value) {
      const filteredOptions = actualFilter.completeParam.options.filter(({ value }) => value === actualFilter.value);
      actualFilter.formatted = filteredOptions.length === 1 ? filteredOptions[0].text : actualFilter.value;
    } else {
      actualFilter.formatted = actualFilter.value;
    }

    if (actualFilter.operator === SearchOperators.BETWEEN.value) {
      if ([SearchTypes.DATE.value, SearchTypes.DATE_TIME.value].includes(actualFilter.completeParam.type.value)) {
        const { dateFormat, dateParse } =
          actualFilter.completeParam.type.value === SearchTypes.DATE.value
            ? { dateFormat: DATE_FORMAT, dateParse: DATE_PARSE_FORMAT }
            : { dateFormat: DATE_FORMAT_WITH_HOURS, dateParse: DATE_PARSE_FORMAT_WITH_HOURS };
        actualFilter.formatted =
          actualFilter.valueLesse && actualFilter.valueGreate
            ? `${moment(actualFilter.valueLesse).format(dateFormat)} a ${moment(actualFilter.valueGreate).format(
                dateFormat
              )}`
            : '';
        actualFilter.valueLesse = actualFilter.valueLesse ? moment(actualFilter.valueLesse).format(dateParse) : '';
        actualFilter.valueGreate = actualFilter.valueGreate ? moment(actualFilter.valueGreate).format(dateParse) : '';
      } else if (
        [SearchTypes.NUMBER.value, SearchTypes.UNGROUPED_NUMBER.value].includes(actualFilter.completeParam.type.value)
      ) {
        actualFilter.formatted = `${actualFilter.valueLesse} a ${actualFilter.valueGreate}`;
      }
    }

    if ([SearchOperators.IS_NOT_NULL.value, SearchOperators.IS_NULL.value].includes(actualFilter.operator)) {
      actualFilter.text = `${actualFilter.completeParam.label} ${SearchOperators[actualFilter.operator].label}`;
    } else if (actualFilter.completeParam.type.value === SearchTypes.ASYNC_QUERY.value) {
      actualFilter.text =
        actualFilter.value[actualFilter.completeParam.store.label] !== undefined
          ? `${actualFilter.completeParam.label}: ${actualFilter.value[actualFilter.completeParam.store.label]}`
          : actualFilter.text;
      actualFilter.value = actualFilter.value[actualFilter.completeParam.store.value] ?? actualFilter.value;
    } else if (actualFilter.operator === SearchOperators.BETWEEN.value) {
      actualFilter.text = `${actualFilter.completeParam.label}: ${actualFilter.formatted}`;
    } else {
      actualFilter.text = `${actualFilter.completeParam.label}: ${actualFilter.formatted}`;
    }

    const selectedList = selected;

    if (actualFilter.id) {
      const indexItem = selectedList.findIndex((item) => item.id == actualFilter.id);

      if (indexItem !== -1) {
        selectedList[indexItem] = toJS(actualFilter);
      }
    } else {
      actualFilter.id = this.state.filtersCount + 1;
      selectedList.push(toJS(actualFilter));
      this.setState({ filtersCount: this.state.filtersCount + 1 });
    }
    this.setState({ selected: selectedList }, () => {
      this._clearForm();
      !isFilterSuggest && this._callSearch();
    });
  }

  _setField(field) {
    let completeParam = null;

    if (field !== null && field !== undefined) {
      completeParam = this.searchParams.filter((param) => param.key === field).pop();
    }

    let value;
    let valueLesse;
    let valueGreate;

    if (this.state.actualFilter.completeParam) {
      if (completeParam?.field === this.state.actualFilter.completeParam.field) {
        value = this.state.actualFilter.value;
        valueLesse = this.state.actualFilter.valueLesse;
        valueGreate = this.state.actualFilter.valueGreate;
      }
    }

    const actualFilter = {
      ...this.state.actualFilter,
      field: completeParam.field,
      completeParam,
      fieldKey: field,
      operator: completeParam.type.operator,
      value: value,
      valueLesse: valueLesse,
      valueGreate: valueGreate,
    };

    this.setState({
      actualFilter: actualFilter,
    });
  }

  _setValue(value) {
    this.setState((prevState) => ({ actualFilter: { ...prevState.actualFilter, value: value } }));
  }

  _setValueLesse(value) {
    this.setState((prevState) => ({ actualFilter: { ...prevState.actualFilter, valueLesse: value } }));
  }

  _setValueGreate(value) {
    this.setState((prevState) => ({ actualFilter: { ...prevState.actualFilter, valueGreate: value } }));
  }

  _getValueField() {
    const { actualFilter } = this.state;

    const disableValueField =
      !actualFilter.operator ||
      [SearchOperators.IS_NOT_NULL.value, SearchOperators.IS_NULL.value].includes(actualFilter.operator);

    let field;
    if (actualFilter.completeParam) {
      if (actualFilter.completeParam.type.value === SearchTypes.DATE.value) {
        field = (
          <div className="p-grid p-fluid p-formgrid">
            <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por intervalo de datas</span>
            <div className="field p-col-12 pl-0 pr-0">
              <Calendar
                id="search-value"
                value={this.getDateAttributeValue(actualFilter.valueLesse)}
                onChange={(e) => {
                  this._setValueLesse(moment(e.value).format(DATE_PARSE_FORMAT));
                }}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe a data inicial'}
              />
            </div>
            <div className="field p-col-12 pl-0 pr-0">
              <Calendar
                id="search-value"
                value={this.getDateAttributeValue(actualFilter.valueGreate)}
                onChange={(e) => this._setValueGreate(moment(e.value).format(DATE_PARSE_FORMAT))}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe a data final'}
              />
            </div>
          </div>
        );
      } else if (actualFilter.completeParam.type.value === SearchTypes.DATE_TIME.value) {
        field = (
          <div className="p-grid p-col-12 p-fluid p-formgrid">
            <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por intervalo de datas</span>
            <div className="field p-col-12 pl-0 pr-0">
              <Calendar
                id="search-value"
                value={this.getDateAttributeValue(actualFilter.valueLesse)}
                onChange={(e) => this._setValueLesse(moment(e.value).format(DATE_PARSE_FORMAT))}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe a data e hora inicial'}
                showTime
              />
            </div>
            <div className="field p-col-12 pl-0 pr-0">
              <Calendar
                id="search-value"
                value={this.getDateAttributeValue(actualFilter.valueGreate)}
                onChange={(e) => this._setValueGreate(moment(e.value).format(DATE_PARSE_FORMAT))}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe a data e hora final'}
                showTime
              />
            </div>
          </div>
        );
      } else if (actualFilter.completeParam.type.value === SearchTypes.NUMBER.value) {
        field = (
          <div className="p-grid p-col-12 p-fluid p-formgrid">
            <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por intervalo numérico</span>
            <div className="field p-col-12 pl-0 pr-0">
              <InputNumber
                id="search-value-lesses-than-equal"
                value={actualFilter.valueLesse}
                onChange={(e) => this._setValueLesse(e.value)}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe o valor inicial'}
              />
            </div>
            <div className="field p-col-12 pl-0 pr-0">
              <InputNumber
                id="search-value-greater-than-equal"
                value={actualFilter.valueGreate}
                onChange={(e) => this._setValueGreate(e.value)}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe o valor final'}
              />
            </div>
          </div>
        );
      } else if (actualFilter.completeParam.type.value === SearchTypes.UNGROUPED_NUMBER.value) {
        field = (
          <div className="p-grid p-col-12 p-fluid p-formgrid">
            <span className="flex text-lg font-bold mt-1">Filtrar por intervalo numérico</span>
            <div className="field p-col-12 pl-0 pr-0">
              <InputNumber
                id="search-value-lesses-than-equal"
                value={actualFilter.valueLesse}
                onChange={(e) => this._setValueLesse(e.value)}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe o valor inicial'}
                useGrouping={false}
              />
            </div>
            <div className="field p-col-12 pl-0 pr-0">
              <InputNumber
                id="search-value-greater-than-equal"
                value={actualFilter.valueGreate}
                onChange={(e) => this._setValueGreate(e.value)}
                disabled={disableValueField}
                placeholder={disableValueField ? '-' : 'Informe o valor final'}
                useGrouping={false}
              />
            </div>
          </div>
        );
      } else if (actualFilter.completeParam.type.value === SearchTypes.ASYNC_QUERY.value) {
        const store = this.props.searchParams.find(
          (filter) => filter.field === actualFilter.completeParam.field
        )?.store;
        field = (
          <div className="p-col-12 pl-0 pr-0">
            <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por seleção</span>
            <AsyncDropdown
              key={actualFilter.completeParam.field}
              id="search-value"
              value={
                actualFilter.value
                  ? actualFilter.value[actualFilter.completeParam.value ?? 'id'] ?? actualFilter.value
                  : null
              }
              onChange={(key, value) => this._setValue(value)}
              store={store}
              disabled={disableValueField}
              placeholder={disableValueField ? '-' : 'Selecione a opção desejada'}
              showClear={false}
            />
          </div>
        );
      } else if (actualFilter.completeParam.type.value === SearchTypes.ENUM.value) {
        field = (
          <div className="p-col-12 pl-0 pr-0">
            <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por seleção</span>
            <Dropdown
              id="search-value"
              value={actualFilter.value}
              optionLabel="text"
              optionValue="value"
              options={actualFilter.completeParam.options}
              onChange={(e) => this._setValue(e.value)}
              disabled={disableValueField}
              placeholder={disableValueField ? '-' : 'Informe a opção desejada'}
            />
          </div>
        );
      } else {
        const key = this.getStorageKey(this.state.actualFilter?.field);
        let valueList = JSON.parse(localStorage.getItem(key)) ?? [];
        const listSize = valueList.length;
        valueList = !this.state.showAllValues ? valueList.slice(0, 3) : valueList;
        listSize > 3 && valueList.push(this.state.showAllValues ? 'Ver menos' : 'Ver mais');
        field = (
          <div className="p-col-12 pl-0 pr-0">
            <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por texto</span>
            {valueList?.length ? (
              <div className="grid justify-content-start">
                {valueList.map((value) => (
                  <div className="col-12 p-0 mb-1">
                    <div
                      style={{
                        width: 'auto',
                        color: ['Ver menos', 'Ver mais'].includes(value) ? '#606EC1' : '#333333',
                        cursor: 'pointer',
                      }}
                      title={value}
                      onClick={() =>
                        ['Ver menos', 'Ver mais'].includes(value)
                          ? this.setState((oldState) => ({
                              ...oldState,
                              showAllValues: !oldState.showAllValues,
                            }))
                          : this.setState((oldState) => ({
                              ...oldState,
                              actualFilter: { ...oldState.actualFilter, value: value },
                            }))
                      }
                      className="underline pt-1 pb-2 pl-2 pr-2 overflow-hidden text-overflow-ellipsis"
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
            <InputText
              id="search-value"
              value={actualFilter.value}
              onChange={(e) => this._setValue(e.target.value)}
              disabled={disableValueField}
              placeholder={disableValueField ? '-' : 'Informe um texto'}
            />
          </div>
        );
      }
    } else {
      field = (
        <div className="p-col-12 pl-0 pr-0">
          <span className="flex text-lg font-bold mt-1 mb-2">Filtrar por seleção</span>
          <Dropdown
            value={actualFilter.value}
            options={this.props.searchParams}
            disabled={
              !actualFilter.operator ||
              [SearchOperators.IS_NOT_NULL.value, SearchOperators.IS_NULL.value].includes(actualFilter.operator)
            }
            onChange={(e) => this._setValue(e.value)}
            placeholder="Selecione a opção desejada"
          />
        </div>
      );
    }

    return field;
  }

  getDateAttributeValue(value) {
    return value ? moment(value).toDate() : value;
  }

  _editElement(id) {
    if (!id) {
      return;
    }
    const elements = this.state.selected.filter((item) => {
      return item.id === id;
    });

    if (elements && elements.length === 1) {
      const actualFilter = elements[0];

      if ([SearchTypes.DATE.value, SearchTypes.DATE_TIME.value].includes(actualFilter?.completeParam?.type?.value)) {
        const { dateParse } =
          actualFilter.completeParam.type.value === SearchTypes.DATE.value
            ? { dateFormat: DATE_FORMAT, dateParse: DATE_PARSE_FORMAT }
            : { dateFormat: DATE_FORMAT_WITH_HOURS, dateParse: DATE_PARSE_FORMAT_WITH_HOURS };
        if (actualFilter.operator === SearchOperators.BETWEEN.value) {
          actualFilter.valueLesse = moment(actualFilter.valueLesse, dateParse);
          actualFilter.valueGreate = moment(actualFilter.valueGreate, dateParse);
        } else {
          actualFilter.value = moment(actualFilter.value, dateParse);
        }
      }
      this.setState({ actualFilter: actualFilter, collapsed: false });
    }
  }

  _removeElement(id) {
    if (!id) {
      return;
    }
    const idList = this.state.selected.map((item) => item.id);
    const index = idList.indexOf(id);
    if (index >= 0) {
      const selectedCopy = [...this.state.selected];
      selectedCopy.splice(index, 1);
      this.setState({ selected: selectedCopy }, () => this._callSearch());
    }
  }

  _disableAddFilter() {
    const { actualFilter } = this.state;
    if (actualFilter.field && actualFilter.operator) {
      if ([SearchOperators.IS_NOT_NULL.value, SearchOperators.IS_NULL.value].includes(actualFilter.operator)) {
        return false;
      } else if (actualFilter.value !== null && actualFilter.value !== undefined && actualFilter.value !== '') {
        return false;
      } else if (actualFilter.operator === SearchOperators.BETWEEN.value) {
        if (
          actualFilter.valueLesse !== null &&
          actualFilter.valueLesse !== undefined &&
          actualFilter.valueLesse !== '' &&
          actualFilter.valueGreate !== null &&
          actualFilter.valueGreate !== undefined &&
          actualFilter.valueGreate !== ''
        ) {
          return false;
        }
      }
    }
    return true;
  }

  _buildSearchParams() {
    const text =
      this.props.suggest && this.state.text && this.state.text.label
        ? this.state.text.label
        : this.props.store.searchText;

    const domainAttributes = this.props.searchFields
      ? this.props.searchFields
      : this.props.store.domain.getDomainAttributes();
    const splittedText = text ? [text] : undefined;
    const orParameters = [];
    const andParameters = [];

    if (this.props.suggest && this.state.text && this.state.text.label) {
      const filterParam = {
        field: 'id',
        operator: SearchOperators.EQUAL_TO.value,
        value: this.state.text.id,
      };
      this.props.useOr ? orParameters.push(filterParam) : andParameters.push(filterParam);
    } else {
      splittedText &&
        domainAttributes.forEach((att) =>
          this.props.elasticsearch
            ? andParameters.push({
                field: att,
                value: splittedText.join(' '),
              })
            : splittedText.forEach((element) => {
                const filterParam = {
                  field: att,
                  operator: SearchOperators.CONTAINS.value,
                  value: element,
                };
                this.props.useOr ? orParameters.push(filterParam) : andParameters.push(filterParam);
              })
        );
    }

    return { orParameters, andParameters };
  }

  getStorageKey(field) {
    return `suggestions${field ? `-${field}` : ''}-${window.location.hash}`;
  }

  updateTextValueSuggestions(params) {
    params
      .filter((param) => param.completeParam.type === SearchTypes.TEXT && !param.fixed && !param.invisible)
      .forEach((param) => {
        const key = this.getStorageKey(param.field);
        const values = JSON.parse(localStorage.getItem(key)) ?? [];
        !values.includes(param.value) && values.unshift(param.value);
        localStorage.setItem(key, JSON.stringify(values?.slice(0, 6)));
      });
  }

  updateSuggestions(params) {
    const actualSuggestions = JSON.parse(localStorage.getItem(this.getStorageKey())) ?? {};
    params
      .filter((param) => !param.fixed && !param.invisible)
      .forEach((param) => {
        if (param.text in actualSuggestions) {
          actualSuggestions[param.text] = {
            ...actualSuggestions[param.text],
            count: actualSuggestions[param.text].count + 1,
          };
        } else {
          actualSuggestions[param.text] = { param, count: 1 };
        }
      });

    localStorage.setItem(this.getStorageKey(), JSON.stringify(actualSuggestions));
    this.updateTextValueSuggestions(params);
  }

  _callSearch() {
    const advancedSearchObject = { andParameters: this.state.selected };
    const searchParams = this._buildSearchParams();
    if (advancedSearchObject.andParameters) {
      searchParams.andParameters = [
        ...searchParams.andParameters,
        ...advancedSearchObject.andParameters.filter((p) => !(p.operator === SearchOperators.BETWEEN.value)),
      ];
      advancedSearchObject.andParameters
        .filter((p) => p.operator === SearchOperators.BETWEEN.value)
        .forEach((p) => {
          searchParams.andParameters.push({
            ...p,
            operator: SearchOperators.GREATER_THAN_EQUAL.value,
            value: p.valueLesse,
          });
          searchParams.andParameters.push({
            ...p,
            operator: SearchOperators.LESSER_THAN_EQUAL.value,
            value: p.valueGreate,
          });
        });
    }
    if (advancedSearchObject.orParameters) {
      searchParams.orParameters = [...searchParams.orParameters, ...advancedSearchObject.orParameters];
    }

    this.updateSuggestions(advancedSearchObject.andParameters);
    this.props.store.setSearchParams(searchParams);
    this.props.store.load();
  }

  _callClean() {
    this.setState({ text: '', selected: [] }, () => this._callSearch());
  }

  @computed
  get _getFilterButtons() {
    const { state } = this;
    const addFilterButton = (
      <FcButton
        key={'add-filter-btn'}
        className={'p-button-secondary'}
        id="add-filter-btn"
        style={{ marginTop: '10px' }}
        icon={'pi pi-plus'}
        iconPos={'right'}
        label={'Adicionar Filtro'}
        type="button"
        onClick={() => this._toggleCollapsed()}
      />
    );
    return [
      ...state.selected
        .filter((element) => !element.invisible)
        .map((element) => {
          return (
            <div key={element.text} style={{ marginRight: '5px', marginTop: '10px', float: 'left' }}>
              <span className={element.fixed ? '' : 'p-buttonset'}>
                <FcButton
                  className={'p-button-secondary'}
                  label={element.text}
                  type="button"
                  onClick={() => !element.fixed && this._editElement(element.id)}
                />
                {!element.fixed && (
                  <FcButton
                    className={'p-button-secondary'}
                    icon={'pi pi-times'}
                    iconPos={'right'}
                    type="button"
                    onClick={() => this._removeElement(element.id)}
                  />
                )}
              </span>
            </div>
          );
        }),
      addFilterButton,
    ];
  }

  _renderSideBarContent(params) {
    return (
      <div className="fles m-4">
        <div id="header" className="flex justify-content-between align-items-center mt-2 text-xl font-bold">
          <div className="flex gap-2 align-items-center">
            <i className="pi pi-filter" />
            <span>Filtros</span>
          </div>
          <FcButton
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => {
              this.setState({ showFilters: false });
              this.context.setRightBarActive(false);
            }}
            style={{ color: 'black' }}
          />
        </div>
        <Divider className="mt-3" />
        {this.state.selected?.filter((element) => !element.invisible && !element.fixed)?.length ? (
          <>
            <div id="selected-filters" className="grid gap-1">
              <span className="flex flex-wrap text-lg font-bold mt-1 col-12">Aplicados</span>
              {this.state.selected
                ?.filter((element) => !element.invisible && !element.fixed)
                .map((element) => (
                  <div
                    key={element.text}
                    style={{
                      marginRight: '5px',
                      marginTop: '10px',
                      float: 'left',
                    }}
                  >
                    <span className={element.fixed ? '' : 'p-buttonset'}>
                      <FcButton
                        className="btn-filter-text"
                        label={element.text}
                        type="button"
                        onClick={() => !element.fixed && this._editElement(element.id)}
                      />
                      {!element.fixed && (
                        <FcButton
                          style={{ height: '100%' }}
                          icon="pi pi-times"
                          iconPos="right"
                          type="button"
                          onClick={() => this._removeElement(element.id)}
                        />
                      )}
                    </span>
                  </div>
                ))}
            </div>
            <Divider className="mt-3" />
          </>
        ) : (
          <></>
        )}
        <div id="campo" className="grid gap-1">
          <span className="flex flex-wrap text-lg font-bold mt-1 col-12">Campo</span>
          {params.map((param) => (
            <>
              <ToggleButton
                onLabel={param.label}
                offLabel={param.label}
                checked={param.field === this.state.actualFilter.field}
                onChange={(e) => {
                  e.value ? this._setField(param.key) : this._clearForm();
                  this.forceUpdate();
                }}
              />
            </>
          ))}
        </div>
        <Divider className="mt-3" />
        <div className="value-content">{this._getValueField()}</div>
        <Divider className="mt-3" />
        <FcButton
          icon="pi pi-plus"
          label={this.state.actualFilter.id ? 'Salvar' : 'Adicionar Filtro'}
          disabled={this._disableAddFilter()}
          onClick={() => this._addFilter()}
        />
      </div>
    );
  }

  _renderSideBar() {
    const sortedParamList = this.searchParams.sort((p1, p2) => p1.label?.length - p2.label?.length);
    const params = [];
    let maxLineLength = 0;
    sortedParamList.forEach((p, i) => {
      let lineLength = 0;
      if (i < sortedParamList.length / 2) {
        params.push(p);
        lineLength += p.label?.length;
      }
      if (i < (sortedParamList.length - 1) / 2) {
        params.push(sortedParamList[sortedParamList.length - i - 1]);
        lineLength += sortedParamList[sortedParamList.length - i - 1]?.label?.length;
      }
      if (lineLength > maxLineLength) {
        maxLineLength = lineLength;
      }
    });

    if (isDesktop() && !this.props.alwaysDrawer) {
      return this._renderSideBarContent(params);
    } else {
      const sidebarWidth = 10 * maxLineLength;
      const sidebarMinWidth = 300;
      return (
        <Sidebar
          visible={this.state.showFilters}
          position="right"
          dismissable
          onHide={() => {
            this.setState({ showFilters: false });
            this._clearForm();
          }}
          showCloseIcon={false}
          style={{ width: `${sidebarWidth > sidebarMinWidth ? sidebarWidth : sidebarMinWidth}px` }}
        >
          {this._renderSideBarContent(params)}
        </Sidebar>
      );
    }
  }

  _beforeSuggest(e) {
    const value = e.query;
    const splittedValue = value ? [value] : [];
    const orParameters = [];
    const andParameters = [];
    this.props.searchFields.forEach((field) => {
      splittedValue.forEach((splitted) => {
        const filterParam = {
          field,
          operator: SearchOperators.CONTAINS.value,
          value: splitted,
        };
        this.props.useOr ? orParameters.push(filterParam) : andParameters.push(filterParam);
      });
    });
    this.props.store.beforeLoadSuggest(value, orParameters, andParameters, this.props.labelSuggest);
  }

  _renderItemTemplate(item) {
    const searchElement = document.getElementsByClassName('basic-search');
    const maxWidth = searchElement && searchElement.length > 0 ? searchElement[0].clientWidth - 80 : 500;
    return (
      <div style={{ maxWidth: `${maxWidth}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.label}
      </div>
    );
  }

  clearFilters() {
    this.setState({ selected: [], text: '' }, () => {
      const { filterSuggest } = this.props;
      if (filterSuggest && filterSuggest.length > 0) {
        this._addFilterSuggestRecursive(filterSuggest, 0);
      } else {
        this._callSearch();
      }
    });
  }

  _dialogFilter() {
    return (
      <ConfirmDialog
        blockScroll
        header="Remover Filtros"
        message={
          <label style={{ color: '#dd0303', paddingLeft: '0px' }}>
            Todos os filtros aplicados serão removidos. Deseja continuar?
          </label>
        }
        visible={this.state.visible}
        accept={this.clearFilters}
        onHide={() => this.setState({ visible: false })}
      />
    );
  }

  render() {
    return (
      <div id="advanced-search-wrapped" style={this.props.style} className={this.props.className}>
        <div className="controls-wrapper gap-2">
          {this.props.suggest ? (
            <>
              <span className="p-input-icon-right w-full cursor-pointer">
                {this.state.text && (
                  <i
                    className="pi pi-times"
                    onClick={() => {
                      this.setState({ text: '' });
                    }}
                  />
                )}
                <AutoComplete
                  value={this.state.text}
                  className="basic-search"
                  suggestions={this.props.store.suggestSearchList}
                  completeMethod={this._beforeSuggest}
                  field="label"
                  id="auto-complete-search"
                  itemTemplate={this._renderItemTemplate}
                  onChange={(e) => {
                    e.preventDefault();
                    this.setState({ text: e.value });
                    this.props.store.setSearchText(e.value);
                  }}
                  placeholder="Digite um texto ou use os filtros para uma pesquisa avançada"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      this._callSearch();
                    }
                  }}
                />
              </span>
            </>
          ) : (
            <>
              <span className="p-input-icon-right w-full cursor-pointer">
                {this.state.text && (
                  <Tooltip value="Limpar">
                    <i
                      className="pi pi-times"
                      onClick={() => {
                        this.setState({ text: '' });
                        this.props.store.setSearchText('');
                      }}
                    />
                  </Tooltip>
                )}

                <InputText
                  className="basic-search"
                  value={this.state.text}
                  onChange={(e) => {
                    e.preventDefault();
                    this.setState({ text: e.target.value });
                    this.props.store.setSearchText(e.target.value.trim());
                  }}
                  placeholder="Digite um texto ou use os filtros para uma pesquisa avançada"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      this._callSearch();
                    }
                  }}
                />
              </span>
            </>
          )}

          <Tooltip value="Buscar">
            <div className="flex" style={{ cursor: 'default' }}>
              <FcButton
                icon="pi pi-search"
                className="p-button"
                id="search-btn-advanced"
                type="button"
                onClick={() => this._callSearch()}
              />
            </div>
          </Tooltip>
          {this.state.selected?.filter((element) => !element.invisible)?.length >= 1 && (
            <Tooltip value="Limpar Filtros">
              <div className="flex" style={{ cursor: 'default' }}>
                <FcButton
                  icon="pi pi-filter-slash"
                  className="p-button-rounded p-button-danger p-button-text"
                  id="search-btn-advanced"
                  type="button"
                  onClick={() => this.setState({ visible: true })}
                />
              </div>
            </Tooltip>
          )}

          {this.props.clearEnable && (
            <Tooltip value="Limpar">
              <div className="flex" style={{ cursor: 'default' }}>
                <FcButton
                  icon="pi pi-trash"
                  id="clean-btn-advanced"
                  className="p-button p-button-danger p-ml-2"
                  type="button"
                  onClick={() => this._callClean()}
                />
              </div>
            </Tooltip>
          )}
          <Tooltip target="#search-btn-advanced" content="Buscar" mouseTrack position="top" mouseTrackTop={5} />
          <Tooltip target="#show-filter-btn" content="Exibir Filtros" mouseTrack position="top" mouseTrackTop={5} />
        </div>
        <div>
          {this.suggestions?.length ? (
            <div id="suggestions" className="flex-nowrap gap-1 mt-2">
              {this.suggestions?.map((element) => (
                <>
                  <ToggleButton
                    className="suggestion-button mr-1"
                    onLabel={element.text}
                    offLabel={element.text}
                    checked={this.state.selected.find((filter) => filter.applied && filter.id === element.id)}
                    onChange={(e) => {
                      if (e.value) {
                        element.applied = true;
                        this.setState(
                          (oldState) => ({ ...oldState, selected: [...oldState.selected, element] }),
                          () => this._callSearch()
                        );
                      } else {
                        element.applied = false;
                        this._removeElement(element.id);
                      }
                    }}
                  />
                </>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        {this.state.showFilters && this._renderSideBar()}
        {this.state.visible && this._dialogFilter()}
      </div>
    );
  }
}

AdvancedSearch.defaultProps = {
  suggest: false,
  suggestSeparator: ' | ',
  filterSuggest: undefined,
  useOr: true,
  clearEnable: false,
};

AdvancedSearch.propTypes = {
  searchParams: PropTypes.array,
  store: PropTypes.any.isRequired,
  searchFields: PropTypes.array.isRequired,
  suggest: PropTypes.bool,
  labelSuggest: PropTypes.array,
  filterSuggest: PropTypes.array,
  useOr: PropTypes.bool,
  clearEnable: PropTypes.bool,
  alwaysDrawer: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  elasticsearch: PropTypes.bool,
};

export default AdvancedSearch;
