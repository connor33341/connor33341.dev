import React from 'react';
import { NavBar } from './sections/NavBar';

const Header: React.FC = () => {
    return (
        <header>
            <NavBar auth={{ user: null }} />
        </header>
    );
};

export default Header;