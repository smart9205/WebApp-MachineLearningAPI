import React from 'react';
import { Link } from "react-router-dom";
import Lightbox from 'react-image-lightbox';

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

const images = [
    ('/images/football/gallery/footb-gallery1.jpg'),
    ('/images/football/gallery/footb-gallery2.jpg'),
    ('/images/football/gallery/footb-gallery3.jpg'),
    ('/images/football/gallery/footb-gallery4.jpg'),
];

const Gallery = () => {
    const [display, setDisplay] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);
    const [isOpenImage, setIsOpenImage] = React.useState(false);

    React.useEffect(() => {
        setDisplay(true);
    }, [])

    return (
        <>
            <section id="gallery" className="gallery-area pt-100 pb-70">
                <div className="container">
                    <div className="section-title">
                        <h2>Photo Gallery</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                    </div>

                    {display ? <Carousel
                        className="gallery-slides owl-carousel owl-theme"
                        responsive={responsive}
                        swipeable={false}
                        draggable={true}
                        showDots={false}
                        infinite={true}
                    >
                        <div className="single-gallery-item">
                            <img src={require("../../assets/images/football/gallery/footb-gallery1.jpg")} alt="img" />
                            <Link to="#popup"
                                className="link-btn popup-btn"
                                onClick={e => { e.preventDefault(); setIsOpenImage(true); setPhotoIndex(0); }}
                            >
                            </Link>
                        </div>

                        <div className="single-gallery-item">
                            <img src={require("../../assets/images/football/gallery/footb-gallery2.jpg")} alt="img" />

                            <Link to="#"
                                className="link-btn popup-btn"
                                onClick={e => { e.preventDefault(); setIsOpenImage(true); setPhotoIndex(1); }}
                            >
                            </Link>
                        </div>

                        <div className="single-gallery-item">
                            <img src={require("../../assets/images/football/gallery/footb-gallery3.jpg")} alt="img" />

                            <Link to="#"
                                className="link-btn popup-btn"
                                onClick={e => { e.preventDefault(); setIsOpenImage(true); setPhotoIndex(2); }}
                            >
                            </Link>
                        </div>

                        <div className="single-gallery-item">
                            <img src={require("../../assets/images/football/gallery/footb-gallery4.jpg")} alt="img" />

                            <Link to="#"
                                className="link-btn popup-btn"
                                onClick={e => { e.preventDefault(); setIsOpenImage(true); setPhotoIndex(3); }}>
                            </Link>
                        </div>
                    </Carousel> : ''}
                </div>

                <div className="gallery-shape1">
                    <img src={require("../../assets/images/football/footb-player2.png")} alt="img" />
                </div>

                {/* Lightbox */}
                {isOpenImage && (
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => setIsOpenImage(false)}
                        onMovePrevRequest={() =>
                            setPhotoIndex((photoIndex + images.length - 1) % images.length)
                        }
                        onMoveNextRequest={() =>
                            setPhotoIndex((photoIndex + 1) % images.length)
                        }
                    />
                )}
            </section>
        </>
    );
}

export default Gallery;