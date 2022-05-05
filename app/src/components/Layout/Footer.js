import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
const Footer = () => {
    const { t } = useTranslation();
    let currentYear = new Date().getFullYear();

    return (
        <footer className="footer-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 col-md-12">
                        <p><i className="flaticon-copyright"></i> {currentYear} {t("footer.copyright")} <a href="http://www.Scouting4U.com/" target="_blank" rel="noopener noreferrer" >Scouting4U</a></p>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <ul className="social">
                            <li>
                                <Link to="https://www.facebook.com/s4upro" target="_blank"><i className="flaticon-facebook-logo"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://twitter.com/S4UPro" target="_blank"><i className="flaticon-twitter"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" target="_blank"><i className="flaticon-instagram"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://www.linkedin.com/company/scouting4u" target="_blank"><i className="flaticon-linkedin"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://www.youtube.com/channel/UC3LeTV-zd6sGSvSayUF2E7g" target="_blank"><i className="flaticon-youtube"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <ul className="info-link">
                            <li><Link to="#">{t("footer.privacyMenu")}</Link></li>
                            <li><Link to="#">{t("footer.termsMenu")}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;