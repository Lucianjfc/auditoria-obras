import PropTypes from 'prop-types';
import Form from './form';

export default function NewRelatorioObra({ history }) {
  return <Form history={history} action="new" />;
}

NewRelatorioObra.propTypes = {
  history: PropTypes.any,
  match: PropTypes.any,
};
