import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { useIdleTimer } from 'react-idle-timer'

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import ForgetPassword from "./components/auth/ForgetPassword";
import Register from "./components/auth/Register";
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";
import Home from "./components/Home";
import Profile from "./components/auth/Profile";
import Game from "./components/game";
import Tagging from "./components/tagging";
import Team from "./components/team";
import Field from "./components/team/Field";
import Player from "./components/player";
import Admin from "./components/admin"

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import { getUser, parseJwt } from './common/utilities'

const PrivateRoute = ({ component: Component, rememberPath = true, ...rest }) => {
  if (rememberPath) localStorage.setItem("path", rest.location.pathname);
  const { user: currentUser } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => currentUser && (currentUser.subscription.length > 0 || currentUser.roles.includes("ROLE_ADMIN"))
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

const AdminRoute = ({ component: Component, rememberPath = true, ...rest }) => {
  if (rememberPath) localStorage.setItem("path", rest.location.pathname);
  const { user: currentUser } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => currentUser && currentUser.roles.includes("ROLE_ADMIN")
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);


  const user = getUser();
  if (user) {
    const decodedJwt = parseJwt(user.accessToken);

    if (decodedJwt.exp * 1000 < Date.now()) {
      logOut();
    }
  }

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);



  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  const handleOnIdle = event => {
    console.log('last active', getLastActiveTime())
    logOut();
  }

  const handleOnActive = event => {
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = event => { }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60,
    // timeout: 1000 * 5,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })

  return (
    <Router history={history}>
      <div>
        <div className="container-fluid">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/forgetpassword" component={ForgetPassword} />
            <Route path="/resetPwdVerify/:code" component={ForgetPassword} />
            <Route path="/verification/:code" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile" component={Profile} />

            <PrivateRoute path='/tagging/:id' component={Tagging} />
            <Route path='/team/:data' component={Field} />
            <Route path='/player/:id' component={Player} />

            <AdminRoute path='/game' component={Game} />
            <AdminRoute path='/admin' component={Admin} />
          </Switch>
        </div>

        <AuthVerify logOut={logOut} />
      </div>
    </Router>
  );
};

export default App;
