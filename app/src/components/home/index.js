import React from 'react';
import { useTranslation } from "react-i18next";
import Banner from './Banner';
import NextMatch from './NextMatch';
import UpcomingMatches from './UpcomingMatches';
import MatcheHighlights from './MatcheHighlights';
import Products from './Products';
import Partners from './Partners';
import Gallery from './Gallery';
import Subscribe from './Subscribe';
import BlogPost from './BlogPost';

const Home = () => {
    const { t } = useTranslation();
    return (
        <>
            <Banner t={t} />

            {/* <NextMatch /> */}

            {/* <UpcomingMatches /> */}

            {/* <MatcheHighlights /> */}

            {/* <Products /> */}

            {/* <Partners /> */}

            {/* <Gallery /> */}

            {/* <Subscribe /> */}

            {/* <BlogPost /> */}
        </>
    );
}

export default Home;