import { Component } from 'react';
import PropTypes from 'prop-types';
import UnexpectedError from '~/pages/UnexpectedError';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };

    this.setError = this.setError.bind(this);
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  setError(newErrorState) {
    this.setState = {
      hasError: newErrorState,
    };
  }

  render() {
    if (this.state.hasError) {
      return <UnexpectedError /* setError={this.setError} */ />;
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
