import React from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from './Footer';
import GoTop from './Shared/GoTop';

const NO_NAV_Routes = ['/tagging', '/team', '/player', '/new_coach', '/shareedit'];

const Layout = ({ children }) => {
    const location = useLocation();
    if (!!NO_NAV_Routes.find((r) => location?.pathname?.startsWith(r))) return <>{children}</>;
    else
        return (
            <div style={{ minHeight: 'calc(100vh - 200px)' }}>
                <Navbar />

                {children}

                {!location?.pathname?.startsWith('/coach') && !location?.pathname?.startsWith('/admin') && <Footer />}

                <GoTop scrollStepInPx="100" delayInMs="10.50" />
            </div>
        );
};

export default Layout;
