import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '../Tooltip';

@observer
class FormField extends React.Component {
  constructor(props) {
    super(props);
  }

  _validateField() {
    const { rule, submitted } = this.props;
    return rule && rule.error && submitted ? { className: 'p-invalid p-error' } : {};
  }

  _getFieldErrorMessage() {
    const { rule, submitted } = this.props;
    if (rule && rule.error && submitted) {
      return <small className="p-error">{rule.message}</small>;
    }
    return null;
  }

  render() {
    const { children, attribute, checkbox, rule, infoTooltip } = this.props;
    const childProps = { id: attribute, rules: rule, ...this._validateField() };
    const isRequired = rule?.rules?.some((r) => r.rule === 'required');
    return (
      <div className={`p-field p-col-${this.props.columns}`}>
        {!checkbox && (
          <label {...this._validateField()} htmlFor={attribute}>
            {this.props.label}
            {isRequired && <span className="p-error"> *</span>}
          </label>
        )}

        {infoTooltip && (
          <Tooltip value={infoTooltip}>
            <label {...this._validateField()} htmlFor={'questionIcon'}>
              <i id="questionIcon" className={`pi pi-question-circle p-ml-1`} />
            </label>
          </Tooltip>
        )}
        {React.cloneElement(children, childProps)}
        {checkbox && (
          <label className="checkbox-label" {...this._validateField()} htmlFor={attribute}>
            {this.props.label}
            {isRequired && <span className="p-error"> *</span>}
          </label>
        )}
        {this._getFieldErrorMessage()}
      </div>
    );
  }
}

FormField.defaultProps = {
  rule: {},
  submitted: false,
  columns: 12,
  checkbox: false,
};

FormField.propTypes = {
  columns: PropTypes.number,
  attribute: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rule: PropTypes.object,
  submitted: PropTypes.bool,
  checkbox: PropTypes.bool,
  children: PropTypes.node,
  infoTooltip: PropTypes.string,
};

export default FormField;
