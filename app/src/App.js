import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import 'react-image-lightbox/style.css';
import '../node_modules/react-modal-video/css/modal-video.min.css';
import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/css/boxicons.min.css';
import './assets/css/flaticon.css';
import './assets/css/style.css';
import './assets/css/responsive.css';

import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import ForgetPassword from './components/auth/ForgetPassword';
import Register from './components/auth/Register';
import Home from './components/home';
import Tagging from './components/tagging';
import Field from './components/team/Field';
import Player from './components/player';
import Admin from './components/admin';

import { logout } from './actions/auth';
import { clearMessage } from './actions/message';

import { history } from './helpers/history';

import AuthVerify from './common/AuthVerify';
import EventBus from './common/EventBus';
import { getUser, parseJwt } from './common/utilities';
import Layout from './components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NewCoach from './components/newcoach';
import Settings from './components/newcoach/settings';
import Teams from './components/newcoach/teams';
import Games from './components/newcoach/games';
import TeamPage from './components/newcoach/teams/teampage';
import Players from './components/newcoach/players';
import Dashboard from './components/newcoach/dashboard';
import Reports from './components/newcoach/reports';
import Edits from './components/newcoach/edits';
import GamePage from './components/newcoach/games/gamePage';
import Opponents from './components/newcoach/opponents';
import Leaders from './components/newcoach/leaders';
import OpponentPage from './components/newcoach/opponents/opponentPage';
import VideoCutter from './components/newcoach/videocutter';
import Corrections from './components/newcoach/corrections';
import Goalkeepers from './components/newcoach/goalkeepers';
import CoachSharedEditVideoPlayer from './components/newcoach/sharedVideoPlayer';

const CustomTheme = () => {
    const { pathname } = useLocation();

    const { setMyTheme } = useMyTheme();

    useEffect(() => {
        setMyTheme(
            createTheme({
                palette: {
                    mode: pathname.startsWith('/new_coach') ? 'light' : 'dark'
                }
            })
        );
    }, [pathname, setMyTheme]);
    return <Outlet />;
};

const PrivateRoute = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    return currentUser && (currentUser.subscription.includes('SUB_TAGGER') || currentUser.roles.includes('ROLE_TAGGER')) ? <Navigate to="/" /> : <Outlet />;
};

const RoleRoute = ({ role }) => {
    const { user: currentUser } = useSelector((state) => state.auth);

    return currentUser && (currentUser.roles.includes(role) || currentUser.roles.includes('ROLE_ADMIN')) ? <Outlet /> : <Navigate to="/" />;
};

const ThemeContext = React.createContext({ theme: {} });
export const useMyTheme = () => React.useContext(ThemeContext);

const App = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [theme, setMyTheme] = React.useState(() =>
        createTheme({
            palette: {
                mode: 'dark'
            }
        })
    );

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
        EventBus.on('logout', () => {
            logOut();
        });

        return () => {
            EventBus.remove('logout');
        };
    }, [currentUser, logOut]);

    return (
        <ThemeProvider theme={theme}>
            <ThemeContext.Provider value={{ theme, setMyTheme }}>
                <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <BrowserRouter history={history}>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<CustomTheme />}>
                                <Route index element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/forgetpassword" element={<ForgetPassword />} />
                                <Route path="/resetPwdVerify/:code" element={<ForgetPassword />} />
                                <Route path="/verification/:code" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/team/:data" element={<PrivateRoute />}>
                                    <Route path="/team/:data" element={<Field />} />
                                </Route>
                                <Route path="/player/:data" element={<PrivateRoute />}>
                                    <Route path="/player/:data" element={<Player />} />
                                </Route>

                                <Route path="/tagging/:id" element={<Tagging />} />

                                <Route path="/shareedit/:code" element={<CoachSharedEditVideoPlayer />} />

                                <Route path="/new_coach" element={<RoleRoute role="ROLE_COACH" />}>
                                    <Route path="/new_coach" element={<Navigate to="/new_coach/teams" replace />} />
                                    <Route
                                        path="/new_coach/dashboard"
                                        element={
                                            <NewCoach>
                                                <Dashboard />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/reports"
                                        element={
                                            <NewCoach>
                                                <Reports />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/settings"
                                        element={
                                            <NewCoach>
                                                <Settings />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/teams"
                                        element={
                                            <NewCoach>
                                                <Teams />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/teams/:teamId"
                                        element={
                                            <NewCoach>
                                                <TeamPage />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/games"
                                        element={
                                            <NewCoach>
                                                <Games />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/games/:gameId"
                                        element={
                                            <NewCoach>
                                                <GamePage />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/edits"
                                        element={
                                            <NewCoach>
                                                <Edits />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/players"
                                        element={
                                            <NewCoach>
                                                <Players />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/opponents"
                                        element={
                                            <NewCoach>
                                                <Opponents />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/opponents/:gameId"
                                        element={
                                            <NewCoach>
                                                <OpponentPage />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/leaders"
                                        element={
                                            <NewCoach>
                                                <Leaders />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/video_cutter"
                                        element={
                                            <NewCoach>
                                                <VideoCutter />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/corrections"
                                        element={
                                            <NewCoach>
                                                <Corrections />
                                            </NewCoach>
                                        }
                                    />
                                    <Route
                                        path="/new_coach/goalkeepers"
                                        element={
                                            <NewCoach>
                                                <Goalkeepers />
                                            </NewCoach>
                                        }
                                    />
                                </Route>

                                <Route path="/admin" element={<RoleRoute role="ROLE_ADMIN" />}>
                                    <Route path="/admin" element={<Admin />} />
                                    <Route path="/admin/:tab" element={<Admin />} />
                                </Route>
                            </Route>

                            {/* <Route path="*" element={<Navigate to="/" />} /> */}
                        </Routes>
                        <AuthVerify logOut={logOut} />
                    </Layout>
                </BrowserRouter>
            </ThemeContext.Provider>
        </ThemeProvider>
    );
};

export default App;
