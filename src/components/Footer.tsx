import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} connor33341.dev. All rights reserved.</p>
            <nav>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/services">Services</a>
                <a>VoxaCommunications</a>
                <a>StellarisChain</a>
                <a>HalogenChain</a>
            </nav>
        </footer>
    );
};

export default Footer;