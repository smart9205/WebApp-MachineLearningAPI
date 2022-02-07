import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { useIdleTimer } from 'react-idle-timer'

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import 'react-image-lightbox/style.css';
import '../node_modules/react-modal-video/css/modal-video.min.css';
import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/css/boxicons.min.css';
import './assets/css/flaticon.css';
import './assets/css/style.css';
import './assets/css/responsive.css';

import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import ForgetPassword from "./components/auth/ForgetPassword";
import Register from "./components/auth/Register";
import Home from "./components/home";
import Tagging from "./components/tagging";
import Field from "./components/team/Field";
import Profile from "./components/player";
import Admin from "./components/admin"

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import { getUser, parseJwt } from './common/utilities'
import Coach from "./components/coach";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const CoachRoute = ({ component: Component, rememberPath = true, ...rest }) => {
  if (rememberPath) localStorage.setItem("path", rest.location.pathname);
  const { user: currentUser } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => currentUser && currentUser.roles.includes("ROLE_COACH")
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

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'dark',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>

      <Router history={history}>
        <link
          href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Navbar />
        <div style={{ marginTop: 60 }}>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/forgetpassword" component={ForgetPassword} />
            <Route path="/resetPwdVerify/:code" component={ForgetPassword} />
            <Route path="/verification/:code" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute path='/tagging/:id' component={Tagging} />
            <Route path='/team/:data' component={Field} />
            <Route path='/player/:id' component={Profile} />

            <CoachRoute path='/coach' component={Coach} />

            <AdminRoute path='/admin' component={Admin} />
            <AdminRoute path='/admin/:tab' component={Admin} />
          </Switch>
        </div>
        <Footer />
        <AuthVerify logOut={logOut} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
