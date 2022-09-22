import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import cookie from 'react-cookies';
import { logout } from '../../actions/auth';
import lang from '../../assets/lang.json';

export default function Navbar() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const savedLanguage = cookie.load('lang') ? cookie.load('lang') : 'en';
    const [language, setLanguage] = useState(savedLanguage);
    const [collapsed, setCallapsed] = useState(true);
    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        let elementId = document.getElementById('navbar');
        document.addEventListener('scroll', () => {
            if (window.scrollY > 170) {
                elementId.classList.add('is-sticky');
            } else {
                elementId.classList.remove('is-sticky');
            }
        });
        // window.scrollTo(0, 0);

        menuActiveClass();
    }, []);

    useEffect(() => {
        cookie.save('lang', language, { path: '/' });
        i18next.changeLanguage(language);
        if (language == 'iw' || language == 'ar') {
            document.body.style.direction = 'rtl';
        } else {
            document.body.style.direction = 'ltr';
        }
    }, [language]);

    const toggleNavbar = () => {
        setCallapsed((c) => !c);
    };
    const menuActiveClass = () => {
        let mainNavLinks = document.querySelectorAll('.navbar-nav li a');
        window.addEventListener('scroll', () => {
            let fromTop = window.scrollY;
            mainNavLinks.forEach((link) => {
                if (link.hash) {
                    let section = document.querySelector(link.hash);

                    if (section?.offsetTop <= fromTop && section?.offsetTop + section?.offsetHeight > fromTop) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        });
    };

    const classOne = collapsed ? 'collapse navbar-collapse' : 'navbar-collapse collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
    return (
        <>
            <nav id="navbar" className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <img src={require('../../assets/LogoforLightBackground.png')} alt="logo" />
                    </Link>

                    <button
                        onClick={toggleNavbar}
                        className={classTwo}
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={classOne} id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto">
                            {!!currentUser ? (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        {t('Home')}
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <AnchorLink onClick={toggleNavbar} offset={() => 100} className="nav-link active" href="#home">
                                            {t('Home')}
                                        </AnchorLink>
                                    </li>
                                    {/* <li className="nav-item">
                                        <AnchorLink
                                            onClick={toggleNavbar}
                                            offset={() => -1}
                                            className="nav-link"
                                            href="#matches"
                                        >
                                            Matches
                                        </AnchorLink>
                                    </li>
                                    <li className="nav-item">
                                        <AnchorLink
                                            onClick={toggleNavbar}
                                            offset={() => -1}
                                            className="nav-link"
                                            href="#highlights"
                                        >
                                            Highlights
                                        </AnchorLink>
                                    </li>
                                    <li className="nav-item">
                                        <AnchorLink
                                            onClick={toggleNavbar}
                                            offset={() => -1}
                                            className="nav-link"
                                            href="#shop"
                                        >
                                            Shop
                                        </AnchorLink>
                                    </li>
                                    <li className="nav-item">
                                        <AnchorLink
                                            onClick={toggleNavbar}
                                            offset={() => -1}
                                            className="nav-link"
                                            href="#partners"
                                        >
                                            Partners
                                        </AnchorLink>
                                    </li>
                                    <li className="nav-item">
                                        <AnchorLink
                                            onClick={toggleNavbar}
                                            offset={() => -1}
                                            className="nav-link"
                                            href="#gallery"
                                        >
                                            Gallery
                                        </AnchorLink>
                                    </li>
                                    <li className="nav-item">
                                        <AnchorLink
                                            onClick={toggleNavbar}
                                            offset={() => -1}
                                            className="nav-link"
                                            href="#news"
                                        >
                                            News
                                        </AnchorLink>
                                    </li> */}
                                </>
                            )}

                            {currentUser && (currentUser?.roles.includes('ROLE_COACH') || currentUser?.roles.includes('ROLE_ADMIN')) && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/coach">
                                        {t('Coach')}
                                    </Link>
                                </li>
                            )}
                            {currentUser && (currentUser?.roles.includes('ROLE_COACH') || currentUser?.roles.includes('ROLE_ADMIN')) && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/new_coach">
                                        {t('New Coach (Beta)')}
                                    </Link>
                                </li>
                            )}
                            {currentUser && currentUser?.roles.includes('ROLE_ADMIN') && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">
                                        {t('Admin')}
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item">
                                {!currentUser ? (
                                    <Link className="nav-link" to="/login">
                                        {t('Signin')}
                                    </Link>
                                ) : (
                                    <Link className="nav-link" to="#" onClick={() => dispatch(logout())}>
                                        {t('Signout')}
                                    </Link>
                                )}
                            </li>
                            <li className="nav-item">
                                <select onChange={(e) => setLanguage(e.target.value)} value={language}>
                                    {lang.map((item, index) => (
                                        <option key={index} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
