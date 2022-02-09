import React from 'react';
import { Link } from "react-router-dom";

const Subscribe = () => {
    return (
        <section className="subscribe-area">
            <div className="container">
                <div className="subscribe-inner-area">
                    <div className="section-title">
                        <h2>Stay Tuned</h2>
                        <p>Subscribe my newsletter and don’t miss any update on new products, promotions or even career events.</p>
                    </div>

                    <form className="newsletter-form">
                        <input type="email" className="input-newsletter" placeholder="Enter your email address" name="email" required />
                        <button type="submit">Subscribe To Newsletter</button>

                        <div className="check-info">
                            <input className="inp-cbx" id="cbx" type="checkbox" />
                            <label className="cbx" htmlFor="cbx">
                                <span>
                                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                                        <polyline points="1 5 4 8 11 1"></polyline>
                                    </svg>
                                </span>
                                <span>I read and accept the <Link to="#">privacy policy.</Link></span>
                            </label>
                        </div>
                    </form>

                    <div className="subscribe-shape1">
                        <img src={require("../../assets/images/football/football1.png")} alt="img" />
                    </div>
                    <div className="subscribe-shape2">
                        <img src={require("../../assets/images/football/football2.png")} alt="img" />
                    </div>
                </div>
            </div >
        </section >
    );
}

export default Subscribe;