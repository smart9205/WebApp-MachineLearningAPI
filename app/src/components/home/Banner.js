import React from 'react';
import { Link } from "react-router-dom";

const Banner = ({t}) => {
    return (
        <div id="home" className="main-banner jarallax">
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container-fluid">
                        <div className="main-banner-content">
                            <span className="sub-title">{t("banner.subtitle")}</span>
                            <h1>{t("banner.title")}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="banner-footer-content">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-sm-6">
                            <span className="email-link">support@scouting4u.comm</span>
                        </div>

                        <div className="col-lg-6 col-sm-6">
                            <ul className="social">
                                <li>
                                    <Link to="https://www.facebook.com/s4upro" target="_blank">
                                        <i className="flaticon-facebook"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://twitter.com/S4UPro" target="_blank">
                                        <i className="flaticon-twitter-1"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" target="_blank">
                                        <i className="flaticon-instagram-1"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://www.linkedin.com/company/scouting4u" target="_blank">
                                        <i className="flaticon-linkedin-1"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://www.youtube.com/channel/UC3LeTV-zd6sGSvSayUF2E7g" target="_blank">
                                        <i className="flaticon-youtube-1"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div >
                    </div >
                </div >
            </div > */}
        </div >
    );
}

export default Banner;