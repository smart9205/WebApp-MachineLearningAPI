import React from 'react';
import { Link } from "react-router-dom";

const ArticleFooter = () => {
    return (
        <div className="article-footer">
            <div className="article-tags">
                <span><i className='bx bx-folder'></i></span>
                <Link to="#">Fashion</Link>
                <Link to="#">Games</Link>
                <Link to="#" > Travel</Link >
            </div >

            <div className="article-share">
                <ul className="social">
                    <li><span>Share:</span></li>
                    <li>
                        <Link to="#" className="facebook" target="_blank">
                            <i className='bx bxl-facebook'></i>

                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="twitter" target="_blank">
                            <i className='bx bxl-twitter'></i>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="linkedin" target="_blank">
                            <i className='bx bxl-linkedin'></i>

                        </Link>
                    </li >
                    <li>
                        <Link to="#" className="instagram" target="_blank">
                            <i className='bx bxl-instagram'></i>

                        </Link>
                    </li >
                </ul >
            </div >
        </div >
    );
}

export default ArticleFooter;