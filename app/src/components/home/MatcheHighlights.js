import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

class MatcheHighlights extends Component {
    // Carousel
    state = {
        display: false
    };

    componentDidMount() {
        this.setState({ display: true })
    }

    // Popup Video
    state = {
        isOpen: false,
    }
    openModal = () => {
        this.setState({ isOpen: true })
    }

    render() {
        return (
            <>
                <div id="highlights">
                    {this.state.display ? <Carousel
                        // className="matches-highlights-slides owl-carousel owl-theme"
                        swipeable={false}
                        draggable={true}
                        showDots={false}
                        infinite={true}
                        responsive={responsive}
                    >
                        <div className="single-matches-highlights-item highlights-bg1">
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="content">
                                            <h3>Matches Highlights</h3>
                                            <span>Champions League - 20 April, 2020</span>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6">
                                        <div className="highlights-video">
                                            <Link to="#play-video"
                                                onClick={e => { e.preventDefault(); this.openModal() }}
                                                className="video-btn popup-youtube"
                                            >
                                                <span>Play Video</span>
                                                <i className="flaticon-play-button"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="single-matches-highlights-item highlights-bg2">
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="content">
                                            <h3>Matches Highlights</h3>
                                            <span>Premier League - 19 April, 2020</span>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6">
                                        <div className="highlights-video">
                                            <Link to="#play-video"
                                                onClick={e => { e.preventDefault(); this.openModal() }}
                                                className="video-btn popup-youtube"
                                            >
                                                <span>Play Video</span>
                                                <i className="flaticon-play-button"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="single-matches-highlights-item highlights-bg3">
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="content">
                                            <h3>Matches Highlights</h3>
                                            <span>Champions League - 18 April, 2020</span>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6">
                                        <div className="highlights-video">
                                            <Link to="#play-video"
                                                onClick={e => { e.preventDefault(); this.openModal() }}
                                                className="video-btn popup-youtube"
                                            >
                                                <span>Play Video</span>
                                                <i className="flaticon-play-button"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="single-matches-highlights-item highlights-bg4">
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="content">
                                            <h3>Matches Highlights</h3>
                                            <span>Premier League - 17 April, 2020</span>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6">
                                        <div className="highlights-video">
                                            <Link to="#play-video"
                                                onClick={e => { e.preventDefault(); this.openModal() }}
                                                className="video-btn popup-youtube"
                                            >
                                                <span>Play Video</span>
                                                <i className="flaticon-play-button"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Carousel> : ''}
                </div>

                {/* If you want to change the video need to update below videoID */}
                {/* <ModalVideo
                    channel='youtube'
                    isOpen={this.state.isOpen}
                    videoId='2Le9TVyWpLY'
                    onClose={() => this.setState({ isOpen: false })}
                /> */}
            </>
        );
    }
}

export default MatcheHighlights;