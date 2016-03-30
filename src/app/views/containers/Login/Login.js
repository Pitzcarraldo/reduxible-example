import React, { Component, PropTypes } from 'react';
import connector from './Login.connector';

@connector
export default class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  state = {
    username: ''
  };

  componentDidMount() {
    this.handleAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleAuth(nextProps);
  }

  handleAuth(props) {
    if (props.user) {
      props.push('/profile');
    }
  }

  handleUserName = ({ target: { value: username } }) => {
    this.setState({ username });
  };

  handleLogin = () => {
    const { login } = this.props;
    login(this.state.username);
  };

  render() {
    const { username } = this.state;
    return (
      <div className="content">
        <div className="pure-g-valign-fix">
          <h2 className="content-subhead">Login</h2>
          <div className="pure-form">
            <input type="text"
              className="pure-input-rounded" placeholder="User Name Here" value={username}
              onChange={this.handleUserName}
            />
            <button className="pure-button-primary" onClick={this.handleLogin}>Login</button>
          </div>
        </div>
      </div>
    );
  }
}
