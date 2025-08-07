import React from 'react';
import { SEO } from '../components/SEO';

const About: React.FC = () => {
    return (
        <>
            <SEO 
                title="About - Connor W - Everything Developer"
                description="Learn more about Connor W, an Everything Developer with expertise in backend, frontend, mobile and embedded applications."
                url="https://connor33341.dev/about"
                tags={['about', 'developer', 'portfolio']}
            />
            <div>
                <h1>About Me</h1>
                <p>This is the about page of my personal website.</p>
                <p>Here you can include information about yourself, your interests, and your work.</p>
            </div>
        </>
    );
};

export default About;