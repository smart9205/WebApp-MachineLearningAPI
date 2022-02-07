import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {

    let currentYear = new Date().getFullYear();

    return (
        <footer className="footer-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 col-md-12">
                        <p><i className="flaticon-copyright"></i> {currentYear} Plaon All Rights Reserved <a href="http://envytheme.com/" target="_blank">EnvyTheme</a></p>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <ul className="social">
                            <li>
                                <Link href="#" target="_blank"><i className="flaticon-facebook-logo"></i>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" target="_blank"><i className="flaticon-twitter"></i>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" target="_blank"><i className="flaticon-instagram"></i>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" target="_blank"><i className="flaticon-linkedin"></i>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" target="_blank"><i className="flaticon-youtube"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <ul className="info-link">
                            <li><Link href="#"><a>Privacy Policy</a></Link></li>
                            <li><Link href="#"><a>Terms & Conditions</a></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;