import React from 'react';
import { Link } from "react-router-dom";

const Products = () => {
    return (
        <section id="shop" className="products-area pt-100 pb-70">
            <div className="container">
                <div className="section-title">
                    <h2>Plaon Shop</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                </div>

                <div className="row">
                    <div className="col-lg-3 col-sm-6">
                        <div className="single-products-box">
                            <img src={require("../../assets/images/football/products/footb-product1.jpg")} alt="img" />

                            <div className="content">
                                <h3>Kreton Footwear</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
                                <Link to="#" className="shop-now-btn">Shop Now
                                </Link>
                            </div>

                            <Link to="#" target="_blank" className="link-btn">
                            </Link>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6">
                        <div className="single-products-box">
                            <img src={require("../../assets/images/football/products/footb-product2.jpg")} alt="img" />

                            <div className="content">
                                <h3>Kreton Denim</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>

                                <Link to="#" className="shop-now-btn">Shop Now
                                </Link>
                            </div>

                            <Link to="#" target="_blank" className="link-btn">
                            </Link>
                        </div>
                    </div >

                    <div className="col-lg-3 col-sm-6">
                        <div className="single-products-box">
                            <img src={require("../../assets/images/football/products/footb-product3.jpg")} alt="img" />

                            <div className="content">
                                <h3>Kreton Underwear</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>

                                <Link to="#" className="shop-now-btn">Shop Now
                                </Link>
                            </div>

                            <Link to="#" target="_blank" className="link-btn">
                            </Link>
                        </div >
                    </div >

                    <div className="col-lg-3 col-sm-6">
                        <div className="single-products-box">
                            <img src={require("../../assets/images/football/products/footb-product4.jpg")} alt="img" />

                            <div className="content">
                                <h3>Kreton Fragrances</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>

                                <Link to="#" className="shop-now-btn">Shop Now
                                </Link>
                            </div>

                            <Link to="#" target="_blank" className="link-btn">
                            </Link>
                        </div >
                    </div >
                </div >
            </div >
        </section >
    );
}

export default Products;