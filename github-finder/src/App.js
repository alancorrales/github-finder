import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import { Alert } from "./components/layout/Alert";
import { About } from "./components/pages/About"
import axios from "axios";

class App extends Component {
  state = {
    user: {},
    users: [],
    repos: [],
    loading: false,
    alert: null
  };

  // Search users
  searchUsers = async query => {
    this.setState({ loading: true });

    const res = await axios.get(`http://api.github.com/search/users?q=${query}&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ users: res.data.items, loading: false });
  };

  // Get a single github user
  getUser = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`http://api.github.com/users/${username}?
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ user: res.data, loading: false });
  }

  // Get an user's repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`http://api.github.com/users/${username}
      /repos?per_page=5&sort=created:asc&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ repos: res.data, loading: false });
  }

  // Clear users search
  clearUsers = () => this.setState({ users: [], loading: false });

  // Show an alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 3000);
  }

  render() {
    const { user, users, repos, loading } = this.state;

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
              <Route exact path='/user/:login' render={props => (
                < User
                  {...props}
                  getUser={this.getUser}
                  getUserRepos={this.getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading} />
              )} />

            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
