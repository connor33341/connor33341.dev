import React from 'react';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
    return (
        <>
            <SEO 
                title="Home - Connor W - Everything Developer"
                description="Welcome to Connor W's portfolio. Everything Developer specializing in backend, frontend, mobile and embedded applications."
                url="https://connor33341.dev/"
                tags={['home', 'portfolio', 'developer']}
            />
            <div>
                <h1>Welcome to a Website</h1>
                <p>This is the homepage where you can find information about me and my projects.</p>
            </div>
        </>
    );
};

export default Home;