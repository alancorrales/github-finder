import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import Search from "./components/users/Search";
import { Alert } from "./components/layout/Alert";
import { About } from "./components/pages/About"
import axios from "axios";

class App extends Component {
  state = {
    users: [],
    loading: false,
    alert: null
  };

  searchUsers = async query => {
    this.setState({ loading: true });
    const res = await axios.get(`http://api.github.com/search/users?q=${query}&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ users: res.data.items, loading: false });
  };

  clearUsers = () => this.setState({ users: [], loading: false });

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 3000);
  }

  render() {
    const { users, loading } = this.state;

    return (
      <Router>
        <div className='App'>
          <Navbar title='Github Finder' icon='fab fa-github' />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact path='/' render={props => (<Fragment>
                  <Search
                    searchUsers={this.searchUsers}
                    clearUsers={this.clearUsers}
                    showClear={users.length > 0}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>)}
              />
              <Route exact path='/about' component={About} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
