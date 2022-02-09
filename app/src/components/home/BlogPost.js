import React from 'react';
import { Link } from "react-router-dom";

const BlogPost = () => {
    return (
        <section id="news" className="blog-area pt-100 pb-70">
            <div className="container">
                <div className="section-title">
                    <h2>Latest News</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="single-blog-post">
                            <div className="post-image">
                                <img src={require("../../assets/images/football/blog/footb-blog1.jpg")} alt="img" />
                                <Link to="/football-single-blog" target="_blank" className="link-btn">
                                </Link>
                            </div>

                            <div className="post-content">
                                <ul className="post-meta">
                                    <li><Link to="#">Champions League</Link></li>
                                    <li>20 April, 2020</li>
                                </ul>

                                <h3>
                                    <Link to="/football-single-blog" target="_blank">Ogbonna blasts 'lax' virus response
                                    </Link>
                                </h3>

                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                                <Link to="/football-single-blog" className="read-more-btn">Read More
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="single-blog-post">
                            <div className="post-image">
                                <img src={require("../../assets/images/football/blog/footb-blog2.jpg")} alt="img" />
                                <Link to="/football-single-blog" target="_blank" className="link-btn">
                                </Link>
                            </div>

                            <div className="post-content">
                                <ul className="post-meta">
                                    <li><Link to="#">Premier League</Link></li>
                                    <li>19 April, 2020</li>
                                </ul>

                                <h3>
                                    <Link to="/football-single-blog" target="_blank">Liverpool title will be special
                                    </Link>
                                </h3>

                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                                <Link to="/football-single-blog" target="_blank" className="read-more-btn">Read More
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3">
                        <div className="single-blog-post">
                            <div className="post-image">
                                <img src={require("../../assets/images/football/blog/footb-blog3.jpg")} alt="img" />
                                <Link to="/football-single-blog" target="_blank" className="link-btn">
                                </Link>
                            </div>

                            <div className="post-content">
                                <ul className="post-meta">
                                    <li><Link to="#">Football</Link></li>
                                    <li>18 April, 2020</li>
                                </ul>

                                <h3>
                                    <Link to="/football-single-blog" target="_blank">Moyes self-isolating as precaution
                                    </Link>
                                </h3>

                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                                <Link to="/football-single-blog" target="_blank" className="read-more-btn">Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );
}

export default BlogPost;