import { PropTypes } from 'mobx-react';
import { Dropdown } from 'primereact/dropdown';

const FcDropdown = (props) => {
  const { optionLabel, options, inOrder } = props;
  const optionsSorted = options.slice().sort((a, b) => a[optionLabel].localeCompare(b[optionLabel]));

  return <Dropdown {...props} options={inOrder ? optionsSorted : options} />;
};

FcDropdown.propTypes = {
  id: PropTypes.string,
  optionLabel: PropTypes.string,
  inOrder: PropTypes.bool,
  options: PropTypes.array,
};

export default FcDropdown;
