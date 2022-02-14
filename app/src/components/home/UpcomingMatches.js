import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 2
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 2
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

class UpcomingMatches extends Component {

    state = {
        display: false
    };

    componentDidMount() {
        this.setState({ display: true })
    }

    render() {
        return (
            <section id="matches" className="upcoming-matches-area pt-100 pb-70">
                <div className="container">
                    <div className="section-title">
                        <h2>Analyzed Matches</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                    </div>

                    {this.state.display ? <Carousel
                        className="upcoming-matches-slides owl-carousel owl-theme"
                        swipeable={false}
                        draggable={true}
                        showDots={false}
                        infinite={true}
                        responsive={responsive}
                        itemClass="carousel-item-padding-40-px"
                    >
                        <div className="single-upcoming-matches-item">
                            <div className="date">
                                <span>25 April, 2020</span>
                            </div>
                            <h3>Semi Final</h3>
                            <span className="sub-title">Champions League</span>

                            <div className="vs-matches">
                                <img src={require("../../assets/images/football/footb-team1.png")} alt="img" />
                                <h4>Napoli</h4>
                                <span>VS</span>
                                <h4>Barcelona</h4>
                                <img src={require("../../assets/images/football/footb-team2.png")} alt="img" />
                            </div>

                            <Link to="#" className="default-btn">Buy Ticket
                            </Link>
                        </div>

                        <div className="single-upcoming-matches-item">
                            <div className="date">
                                <span>15 May, 2020</span>
                            </div>
                            <h3>Final</h3>
                            <span className="sub-title">Champions League</span>

                            <div className="vs-matches">
                                <img src={require("../../assets/images/football/footb-team1.png")} alt="img" />
                                <h4>Real Madrid</h4>
                                <span>VS</span>
                                <h4>Barcelona</h4>
                                <img src={require("../../assets/images/football/footb-team2.png")} alt="img" />
                            </div>

                            <Link to="#" className="default-btn">Buy Ticket
                            </Link>
                        </div>

                        <div className="single-upcoming-matches-item">
                            <div className="date">
                                <span>29 April, 2020</span>
                            </div>
                            <h3>1st Round</h3>
                            <span className="sub-title">La Liga</span>

                            <div className="vs-matches">
                                <img src={require("../../assets/images/football/footb-team1.png")} alt="img" />
                                <h4>Sevilla</h4>
                                <span>VS</span>
                                <h4>Barcelona</h4>
                                <img src={require("../../assets/images/football/footb-team2.png")} alt="img" />
                            </div>

                            <Link to="#" className="default-btn">Buy Ticket</Link>
                        </div>
                    </Carousel> : ''}
                </div>

                <div className="upcoming-matches-shape1">
                    <img src={require("../../assets/images/football/footb-player1.png")} alt="img" />
                </div>
            </section>
        );
    }
}

export default UpcomingMatches;