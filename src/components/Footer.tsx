import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} My Personal Website. All rights reserved.</p>
            <nav>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </nav>
        </footer>
    );
};

export default Footer;