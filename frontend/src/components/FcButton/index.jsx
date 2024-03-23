import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'primereact/button';
import { hashCodePath, getStringOfChildrenIfExist } from '../../utils/utils';

class FcButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tooltipOptions = this.props.tooltipOptions ?? { position: 'left' };
    const copyProps = { ...this.props };
    if (!copyProps['data-cy']) {
      let dataCy = 'button';
      if (copyProps.label) dataCy = copyProps.label.toLowerCase();
      else if (copyProps.tooltip && typeof copyProps.tooltip === 'string') dataCy = copyProps.tooltip.toLowerCase();
      else if (copyProps.children) dataCy = getStringOfChildrenIfExist(copyProps.children, dataCy);
      else if (copyProps.icon && typeof copyProps.icon === 'string') dataCy = copyProps.icon.toLowerCase();
      copyProps['data-cy'] = hashCodePath() + '-' + dataCy.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return (
      <Button {...copyProps} tooltipOptions={{ ...tooltipOptions, showOnDisabled: true }}>
        {copyProps.children}
      </Button>
    );
  }
}

FcButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
  tooltip: PropTypes.any,
  'data-cy': PropTypes.string,
  tooltipOptions: PropTypes.object,
};

export default FcButton;
